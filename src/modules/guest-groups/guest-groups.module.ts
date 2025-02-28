import { Module } from '@nestjs/common';
import { GuestGroupsService } from './guest-groups.service';
import { GuestGroupsController } from './guest-groups.controller';
import { GuestGroupMembersModule } from '../guest-group-members/guest-group-members.module';

@Module({
  providers: [GuestGroupsService, ],
  imports:[GuestGroupMembersModule,],
  controllers: [GuestGroupsController],
  exports:[GuestGroupsService]
})
export class GuestGroupsModule {}
