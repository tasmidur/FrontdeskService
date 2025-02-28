import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppLoggerService } from './common/logger/logger.service';
import { UtilsModule } from './common/utils/utils.module';
import { CheckInEventWebhookModule } from './modules/check-in-event-webhook/check-in-event-webhook.module';
import { PrismaModule } from './modules/database/prisma.module'; // PrismaModule already provides PrismaService
import { ExtensionsModule } from './modules/extensions/extensions.module';
import { GuestGroupMembersModule } from './modules/guest-group-members/guest-group-members.module';
import { GuestGroupsModule } from './modules/guest-groups/guest-groups.module';
import { GuestMembershipsModule } from './modules/guest-memberships/guest-memberships.module';
import { GuestStayHistoryModule } from './modules/guest-stay-history/guest-stay-history.module';
import { GuestsModule } from './modules/guests/guests.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { RoomTypesModule } from './modules/room-types/room-types.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { SubscriptionEventWebhookModule } from './modules/subscription-event-webhook/subscription-event-webhook.module';

import { ScheduleModule } from '@nestjs/schedule';
import { CronJobForWebHookModule } from './modules/cron-job-for-web-hook/cron-job-for-web-hook.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    CheckInEventWebhookModule,
    SubscriptionEventWebhookModule,
    GuestGroupsModule,
    UtilsModule,
    GuestsModule,
    GuestGroupMembersModule,
    ReservationsModule,
    GuestMembershipsModule,
    RoomTypesModule,
    RoomsModule,
    GuestStayHistoryModule,
    ExtensionsModule,
    CronJobForWebHookModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppLoggerService],
  exports: [AppLoggerService],
})
export class AppModule {}
