import { Module } from '@nestjs/common';
import { GuestGroupMembersService } from './guest-group-members.service';

@Module({
  providers: [GuestGroupMembersService],
  exports:[GuestGroupMembersService]
})
export class GuestGroupMembersModule {}
