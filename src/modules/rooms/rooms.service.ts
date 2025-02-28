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

  async getRooms() {}
}
