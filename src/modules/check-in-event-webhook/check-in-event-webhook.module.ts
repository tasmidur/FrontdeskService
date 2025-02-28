import { Module } from '@nestjs/common';
import { CheckInEventWebhookController } from './check-in-event-webhook.controller';
import { CheckInEventWebhookService } from './check-in-event-webhook.service';
import { GuestGroupsModule } from '../guest-groups/guest-groups.module';
import { GuestsModule } from '../guests/guests.module';
import { ReservationsModule } from '../reservations/reservations.module';
import { GuestMembershipsModule } from '../guest-memberships/guest-memberships.module';
import { RoomTypesModule } from '../room-types/room-types.module';
import { GuestStayHistoryModule } from '../guest-stay-history/guest-stay-history.module';
import { ExtensionsModule } from '../extensions/extensions.module';
import { RoomsModule } from '../rooms/rooms.module';

@Module({
  controllers: [CheckInEventWebhookController],
  imports:[
    GuestGroupsModule
    , ReservationsModule
    , GuestStayHistoryModule
    , RoomTypesModule
    , GuestMembershipsModule
    , GuestsModule
    , ExtensionsModule
    , RoomsModule
  ],
  providers: [
    CheckInEventWebhookService
  ],
  exports:[CheckInEventWebhookService],
})
export class CheckInEventWebhookModule {}
