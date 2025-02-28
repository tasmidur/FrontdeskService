import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UtilityService } from '../../common/utils/utility/utility.service';

@Injectable()
export class GuestStayHistoryService {
    constructor(private prismaService: PrismaService, 
            private utilityService:UtilityService,) {}
        
            async CreateWebhookGuestStay(reservationId : string, guestId : string, checkInDate : string, roomId : string, guestShare : string, guestName : string): Promise<any>{
                
                const utcCheckInDate = this.utilityService.convertToUTCISODateString(checkInDate);
                return this.prismaService.guestStayHistory.create({
                    data:{
                        Id : this.utilityService.generateUuid(),
                        CreatedAt : this.utilityService.getCurrentISODate(),
                        NumberOfAdults : '1',
                        ActualCheckedInDate : utcCheckInDate,
                        ReservationId_FK : reservationId,
                        RoomId_FK : roomId,
                        IsShared : guestShare                        
                    }
                })
                .then(res=>{
                    return this.prismaService.stayingGuestDetails.create({
                        data:{
                            Id : this.utilityService.generateUuid(),
                            CreatedAt : this.utilityService.getCurrentISODate(),
                            GuestId_FK : guestId,
                            GuestName : guestName,
                            GuestStayHistoryId_FK : res.Id

                        }
                    })
                })

            }
}
