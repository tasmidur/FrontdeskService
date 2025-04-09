import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ExtensionsService } from '../extensions/extensions.service';
import { GuestGroupsService } from '../guest-groups/guest-groups.service';
import { GuestMembershipsService } from '../guest-memberships/guest-memberships.service';
import { GuestStayHistoryService } from '../guest-stay-history/guest-stay-history.service';
import { GuestsService } from '../guests/guests.service';
import { ReservationsService } from '../reservations/reservations.service';
import { RoomTypesService } from '../room-types/room-types.service';
import { RoomsService } from '../rooms/rooms.service';
import { EventDetailsDto } from './dto/check-in.dto';

@Injectable()
export class CheckInEventWebhookService {
  constructor(
    private prismaService: PrismaService,
    private readonly guestGroupsService: GuestGroupsService,
    private readonly reservationsService: ReservationsService,
    private readonly guestStayHistoryService: GuestStayHistoryService,
    private readonly roomTypesService: RoomTypesService,
    private readonly guestMembershipsService: GuestMembershipsService,
    private readonly guestsService: GuestsService,
    private readonly extensionsService: ExtensionsService,
    private readonly roomsService: RoomsService,
  ) {}

  //to do : 1. inorporate rollback when fails and store error in corresponding ThirdPartySubscription table record
  async doReservation(
    eventDetails: EventDetailsDto,
    propertyId: string,
  ): Promise<any> {
    let processingGuest;
    return this.guestsService
      .updateOrCreateWebhookGuest(eventDetails, propertyId)
      .then(guestResult => {
        let guestMembership;
        let guestGroupAndMember;
        if (eventDetails.GuestType) {
          //loyalty
          guestMembership =
            this.guestMembershipsService.registerWebhookGuestMembership(
              eventDetails.GuestType,
              guestResult.Id,
            );
        }
        if (eventDetails.GroupCode) {
          guestGroupAndMember =
            this.guestGroupsService.getOrCreateWebhookGuestGroupAndMember(
              eventDetails.GroupCode,
              propertyId,
              guestResult.Id,
              eventDetails.GuestShare,
            );
        }

        let roomTypeAndRoom =
          this.roomTypesService.getOrCreateWebhookRoomTypeAndRoom(
            'Regular',
            eventDetails.RoomNumber,
            propertyId,
          ); //room is also created here
        let extension = this.extensionsService.getOrCreateWebhookExtension(
          eventDetails.ExtensionNumber,
          propertyId,
        );
        return Promise.all([
          guestMembership,
          guestGroupAndMember,
          roomTypeAndRoom,
          extension,
        ]).then(
          ([resGuestMembership, resGuestGrpMember, resRoom, resExtension]) => {
            processingGuest = {
              guestId: guestResult.Id,
              guestGroupMemberId: resGuestGrpMember?.Id,
              guestName: `${guestResult.FirstName} ${guestResult.LastName}`,
              roomTypeId: resRoom.RoomTypeId_FK,
              roomId: resRoom.Id,
            };
            return this.roomsService.getOrAssignWebhookRoomExtension(
              resRoom.Id,
              resExtension.Id,
            );
          },
        );
      })
      .then(() => {
        return this.reservationsService.createWebhookReservation(
          processingGuest.guestId,
          processingGuest.guestName,
          eventDetails.CheckInTime,
          processingGuest.guestGroupMemberId,
          propertyId,
          processingGuest.roomTypeId,
          eventDetails.AnticipatedCheckOutTime,
        );
      })
      .then(reservationDet => {
        return this.guestStayHistoryService.CreateWebhookGuestStay(
          reservationDet.ReservationId_FK,
          processingGuest.guestId,
          eventDetails.CheckInTime,
          processingGuest.roomId,
          eventDetails.GuestShare,
          processingGuest.guestName,
        );
      });
  }
}
