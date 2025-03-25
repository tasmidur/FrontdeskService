import { Injectable } from '@nestjs/common';
import { UtilityService } from '../../common/utils/utility/utility.service';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class GuestStayHistoryService {
  constructor(
    private prismaService: PrismaService,
    private utilityService: UtilityService,
  ) {}
  async CreateWebhookGuestStay(
    reservationId: string,
    guestId: string,
    checkInDate: string,
    roomId: string,
    guestShare: string,
    guestName: string,
  ): Promise<any> {
    const utcCheckInDate =
      this.utilityService.convertToUTCISODateString(checkInDate);
    return this.prismaService.guestStayHistory.create({
      data: {
        Id: this.utilityService.generateUuid(),
        CreatedAt: this.utilityService.getCurrentISODate(),
        GuestId_FK: guestId,
        NumberOfAdults: 1,
        ActualCheckedInDate: utcCheckInDate,
        ReservationId_FK: reservationId,
        RoomId_FK: roomId,
        IsShared: guestShare,
      },
    });
  }
}
