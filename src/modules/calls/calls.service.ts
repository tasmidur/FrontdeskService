import { Injectable } from '@nestjs/common';
import { UtilityService } from '../../common/utils/utility/utility.service';
import { PrismaService } from '../database/prisma.service';
import { CreateCallDto } from './dto/create-call.dto';
import { UpdateCallDto } from './dto/update-call.dto';

@Injectable()
export class CallsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly utilityService: UtilityService,
  ) {}

  async create(callDto: CreateCallDto, request: any): Promise<any> {
    const extension = await this.prismaService.extensions.findFirst({
      where: {
        PropertyId_FK: request?.user?.ActiveProperty?.Id,
        ExtensionNumber: callDto.ExtensionNumber,
      }, // Assuming ExtensionNumber is part of the DTO
    });

    if (!extension) {
      throw new Error('Extension not found');
    }
    return await this.prismaService.call.create({
      data: {
        Id: this.utilityService.generateUuid(),
        ExtensionId_FK: extension?.Id,
        CallType: callDto.CallType,
        CallStatus: callDto.CallStatus,
      },
    });
  }

  async update(callDto: UpdateCallDto, id: string): Promise<any> {
    return await this.prismaService.call.update({
      where: {
        Id: id,
      },
      data: {
        ...callDto,
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

    const calls = await this.prismaService.call.findMany({
      orderBy: { CreatedAt: 'desc' },
      skip: offset, // Skip the records for the previous pages
      take: limit, // Limit the number of records returned
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
                      include: {
                        StayingGuestDetails: {
                          include: { Guests: true },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return {
      page,
      limit,
      total: calls?.length, // Total number of calls returned
      data: calls,
    };
  }
  async getActiveCallByExtension(
    extensionNumber: string,
    request: any,
  ): Promise<any> {
    const propertyId = request?.user?.ActiveProperty?.Id;
    const extension = await this.prismaService.extensions.findFirst({
      where: {
        PropertyId_FK: propertyId,
        ExtensionNumber: extensionNumber,
      },
      include: {
        Calls: {
          orderBy: { CreatedAt: 'desc' }, // Sort by DateTime to get the most recent
          take: 1, // Limit to 1 for the latest call
        },
        RoomExtensions: {
          include: {
            Rooms: {
              include: {
                GuestStayHistory: {
                  where: {
                    ActualCheckedOutDate: null, // Assume active stay if not checked out
                  },
                  take: 1, // Most recent stay
                  include: {
                    StayingGuestDetails: {
                      include: {
                        Guests: true, // For Guest Name and Status
                      },
                    },
                  },
                },
                RoomType: true, // Include Room Type details
              },
            },
          },
        },
        Property: true, // Include Property details
      },
    }); // Include Property details
    return extension;
  }
}
