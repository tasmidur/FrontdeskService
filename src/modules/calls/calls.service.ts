import { Injectable } from '@nestjs/common';
import { AppLoggerService } from 'src/common/logger/logger.service';
import { UtilityService } from '../../common/utils/utility/utility.service';
import { PrismaService } from '../database/prisma.service';
import { CreateCallDto } from './dto/create-call.dto';
import { UpdateCallDto } from './dto/update-call.dto';

@Injectable()
export class CallsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly utilityService: UtilityService,
    private readonly logger: AppLoggerService,
  ) {}

  async create(callDto: CreateCallDto, request: any): Promise<any> {
    const requestPayload: any = {
      Id: this.utilityService.generateUuid(),
      CallType: callDto.CallType,
      CallStatus: callDto.CallStatus,
      CreatedAt: this.utilityService.getCurrentISODate(),
    };

    if (this.utilityService.validatePhone(callDto.ExtensionNumber)) {
      const guest = await this.prismaService.guests.findFirst({
        where: {
          Phone: callDto.ExtensionNumber,
        },
        select: {
          Id: true,
        },
      });
      if (guest) {
        requestPayload.GuestId_FK = guest.Id || null;
      } else {
        this.logger.log(
          `Call Log:Guest:InvlidExtensionNumber: ${JSON.stringify(callDto, null, 2)}`,
        );
      }
    } else {
      const extension = await this.prismaService.extensions.findFirst({
        select: {
          Id: true,
        },
        where: {
          PropertyId_FK: request?.user?.ActiveProperty?.Id,
          ExtensionNumber: callDto.ExtensionNumber,
        }, // Assuming ExtensionNumber is part of the DTO
      });
      if (extension) {
        requestPayload.ExtensionId_FK = extension.Id || null;
      } else {
        this.logger.log(
          `Call Log:Extensions:InvlidExtensionNumber: ${JSON.stringify(callDto, null, 2)}`,
        );
      }
    }
    if (requestPayload?.ExtensionId_FK || requestPayload?.GuestId_FK) {
      this.logger.log(
        `Call Log:Call:RequestPayload: ${JSON.stringify(requestPayload, null, 2)}`,
      );
      await this.prismaService.call.create({
        data: {
          ...requestPayload, // Spread the requestPayload object
        },
      });
    }
    return 'Success';
  }

  async update(callDto: UpdateCallDto, id: string): Promise<any> {
    return await this.prismaService.call.update({
      where: {
        Id: id,
      },
      data: {
        ...callDto,
        UpdatedAt: this.utilityService.getCurrentISODate(),
      },
    });
  }
  async getRecentCallsByExtension(
    extensionNumber: string,
    request: any,
  ): Promise<any> {
    const propertyId = request?.user?.ActiveProperty?.Id;
    const page: number = parseInt(request?.query?.page) || 1; // Default to page 1
    const limit: number = parseInt(request?.query?.limit) || 10; // Default to limit 10

    // Validate page and limit
    if (page < 1 || limit < 1) {
      throw new Error('Page and limit must be positive integers.');
    }

    // Calculate the offset for pagination
    const offset = (page - 1) * limit;
    console.log('extensionNumber', extensionNumber);

    // Determine if extensionNumber is a phone number
    const isPhone = this.utilityService.validatePhone(extensionNumber);

    // Build the where clause for Call
    const whereClause = isPhone
      ? {
          Guest: {
            Phone: extensionNumber,
          },
        }
      : {
          Extension: {
            ExtensionNumber: extensionNumber,
            PropertyId_FK: propertyId,
          },
        };

    // Fetch paginated calls
    const calls = await this.prismaService.call.findMany({
      where: whereClause,
      orderBy: { CreatedAt: 'desc' },
      skip: offset,
      take: limit,
      include: {
        Guest: true, // Always include Guest data
        Extension: {
          include: {
            RoomExtensions: {
              include: {
                Rooms: {
                  include: {
                    GuestStayHistory: {
                      where: { ActualCheckedOutDate: null },
                      take: 1,
                      include: { Guests: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    // Fetch total count for pagination metadata
    const total = await this.prismaService.call.count({
      where: whereClause,
    });

    return {
      page,
      limit,
      total, // Total matching records in the database
      data: calls,
    };
  }
  async getActiveCallByExtension(
    extensionNumber: string,
    request: any,
  ): Promise<any> {
    if (this.utilityService.validatePhone(extensionNumber)) {
      const guestDetails = await this.getCallInfoFromGuest(extensionNumber);
      return {
        GuestName: guestDetails?.FirstName + ' ' + guestDetails?.LastName,
        GuestStatus: null,
        CheckInDate: null,
        CheckOutDate: null,
        VoiceMail: null,
        NextWakeUpCall: null,
      };
    } else {
      const callData = await this.getCallInfoFromExtension(
        extensionNumber,
        request,
      );
      const extension = callData?.Extension;
      const room = extension?.RoomExtensions[0]?.Rooms || ({} as any);
      const guestStayHistory = room?.GuestStayHistory[0]; // Assuming there's at least one guest stay history
      const guest = guestStayHistory?.Guests || ({} as any);

      return {
        PropertyName: extension?.Property?.Name || null,
        RoomNumber: room?.RoomNo,
        RoomType: room?.RoomType?.RoomTypeName || null,
        RoomStatus: room?.RoomStatus,
        GuestName: guest ? `${guest.FirstName} ${guest.LastName}` : null,
        GuestStatus: guestStayHistory ? 'Checked In' : null, // You can adjust this logic based on your requirements
        CheckInDate: guestStayHistory?.ActualCheckedInDate,
        CheckOutDate: guestStayHistory?.ActualCheckedOutDate,
        VoiceMail: callData?.VoiceMail,
        NextWakeUpCall: callData?.NextWakeUpCall, // Assuming this is a property of the call data
      };
    }
  }
  async getCallInfoFromGuest(extensionNumber: string) {
    return await this.prismaService.guests.findFirst({
      where: {
        Phone: extensionNumber,
      },
    });
  }
  async getCallInfoFromExtension(extensionNumber: string, request: any) {
    const propertyId = request?.user?.ActiveProperty?.Id;
    const call = await this.prismaService.call.findFirst({
      include: {
        Extension: {
          where: {
            ExtensionNumber: extensionNumber,
            PropertyId_FK: propertyId,
          },
          include: {
            RoomExtensions: {
              include: {
                Rooms: {
                  include: {
                    GuestStayHistory: {
                      where: { ActualCheckedOutDate: null },
                      take: 1,
                      include: { Guests: true },
                    },
                    RoomType: true,
                  },
                },
              },
            },
            Property: true,
          },
        },
      },
    });
    return call;
  }
}
