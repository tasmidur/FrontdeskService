import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UtilityService } from '../../common/utils/utility/utility.service';
import { RoomsService } from './../rooms/rooms.service';

@Injectable()
export class RoomTypesService {

    constructor(private prismaService: PrismaService, 
        private utilityService:UtilityService,
        private roomsService:RoomsService) {}
    
        async getOrCreateWebhookRoomTypeAndRoom(roomTypeName : string, roomNumber : string, propertyId : string): Promise<any>{
            return this.prismaService.roomType.findFirst({
                where : {RoomTypeName : roomTypeName}
            })
            .then(res => {
                if(res) return res;
                return this.prismaService.roomType.create({
                    data:{
                        Id : this.utilityService.generateUuid(),
                        PropertyId_FK : propertyId,
                        RoomTypeName : roomTypeName,
                        IsActive : 'true',
                        CreatedAt : this.utilityService.getCurrentISODate()
                    }
                })
            })
            .then(res=>{
                return this.roomsService.getOrCreateWebhookRoom(res.Id, roomNumber, propertyId)
            })

        }
}
