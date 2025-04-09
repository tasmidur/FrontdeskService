import { Injectable } from '@nestjs/common';
import { UtilityService } from '../../common/utils/utility/utility.service';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ReservationsService {
  constructor(
    private prismaService: PrismaService,
    private utilityService: UtilityService,
  ) {}

  async createWebhookReservation(
    guestId: string,
    guestName: string,
    checkInTime: string,
    guestGroupMemberId: string,
    propertyId: string,
    roomTypeId: string,
    anticipatedCheckOutTime: string,
  ): Promise<any> {
    const utcCheckInDate =
      this.utilityService.convertToUTCISODateString(checkInTime);
    const utcAnticipatedCheckOutTime =
      this.utilityService.convertToUTCISODateString(
        new Date(anticipatedCheckOutTime).toString(),
      );
    return this.prismaService.reservations
      .create({
        data: {
          Id: this.utilityService.generateUuid(),
          PropertyId_FK: propertyId,
          ReservationCode: this.utilityService.getReservationCode(),
          ReservationSource: 'Jazz',
          ReservationDate: this.utilityService.getCurrentISODate(),
          ReservationType: 'OnPremise',
          PrimaryGuestID_FK: guestId,
          GuestGroupMembersId_FK: guestGroupMemberId,
          PrimaryGuestName: guestName,
          CheckInDate: checkInTime,
          ReservationStatus: 'CheckedIn',
          NumberOfAdults: '1',
          CreatedAt: this.utilityService.getCurrentISODate(),
          IsAutoSystemReservation: 'true',
          UtcReservationDate: utcCheckInDate,
          UtcCheckInDate: utcCheckInDate,
          UtcTentativeCheckedInDate: utcCheckInDate,
          UtcTentativeCheckedOutDate: utcAnticipatedCheckOutTime,
        },
      })
      .then(res => {
        return this.prismaService.reservationDetails.create({
          data: {
            Id: this.utilityService.generateUuid(),
            ReservationId_FK: res.Id,
            RoomTypeId_FK: roomTypeId,
            NumberOfRooms: '1',
            CreatedAt: this.utilityService.getCurrentISODate(),
          },
        });
      });
  }
}
