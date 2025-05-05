import { Injectable } from '@nestjs/common';
import { UtilityService } from '../../common/utils/utility/utility.service';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class RoomsService {
  constructor(
    private prismaService: PrismaService,
    private utilityService: UtilityService,
  ) {}

  async getOrCreateWebhookRoom(
    roomTypeId: string,
    roomNumber: string,
    propertyId: string,
  ): Promise<any> {
    return this.prismaService.rooms
      .findFirst({
        where: {
          PropertyId_FK: propertyId,
          RoomNo: roomNumber,
          RoomTypeId_FK: roomTypeId,
          IsActive: 'true',
        },
      })
      .then(res => {
        /* if(res){
                        if(res.RoomStatus.toLowerCase() != 'vacant') throw new HttpException(`Room ${roomNumber} is not vacant`, HttpStatus.NOT_FOUND);
                        return res;

                    } */
        return this.prismaService.rooms.create({
          data: {
            Id: this.utilityService.generateUuid(),
            CreatedAt: this.utilityService.getCurrentISODate(),
            IsActive: 'true',
            PropertyId_FK: propertyId,
            RoomNo: roomNumber,
            RoomStatus: 'Occupied',
            RoomTypeId_FK: roomTypeId,
          },
        });
      });
  }

  async getOrAssignWebhookRoomExtension(
    roomId: string,
    extensionId: string,
  ): Promise<any> {
    return this.prismaService.roomExtensions.upsert({
      where: {
        RoomId_FK_ExtensionId_FK: {
          RoomId_FK: roomId,
          ExtensionId_FK: extensionId,
        },
      },
      update: {
        IsActive: 'true',
      },
      create: {
        CreatedAt: this.utilityService.getCurrentISODate(),
        ExtensionId_FK: extensionId,
        Id: this.utilityService.generateUuid(),
        RoomId_FK: roomId,
        IsActive: 'true',
      },
    });
  }

  async getRooms(request: any) {
    const propertyId = request?.user?.ActiveProperty?.Id;
    const page: number = parseInt(request?.query?.page) || 1; // Default to page 1
    const limit: number = parseInt(request?.query?.limit) || 10; // Default to limit 10

    // Validate page and limit
    if (page < 1 || limit < 1) {
      throw new Error('Page and limit must be positive integers.');
    }
    // Calculate the offset for pagination
    const offset = (page - 1) * limit;

    const rooms = await this.prismaService.rooms.findMany({
      where: {
        PropertyId_FK: propertyId,
      },
      include: {
        GuestStayHistory: {
          where: {
            ActualCheckedInDate: { not: null },
            ActualCheckedOutDate: null,
          },
          include: {
            Guests: true,
          },
        },
        RoomType: {
          include: {
            Property: true,
          },
        },
        RoomExtensions: {
          include: {
            Extensions: true,
          },
        },
      },
      skip: offset,
      take: limit,
    });
    return {
      page,
      limit,
      total: rooms?.length, // Total number of calls returned
      data: rooms,
    };
  }
  async getRoom(id: string) {
    const room = await this.prismaService.rooms.findFirst({
      where: {
        Id: id,
      },
      include: {
        GuestStayHistory: {
          where: {
            ActualCheckedInDate: { not: null },
            ActualCheckedOutDate: null,
          },
          include: {
            Guests: true,
          },
        },
        RoomType: {
          include: {
            Property: true,
          },
        },
        RoomExtensions: {
          include: {
            Extensions: true,
          },
        },
      },
    });
    return room;
  }
}
