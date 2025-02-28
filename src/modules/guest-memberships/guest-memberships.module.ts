import { Module } from '@nestjs/common';
import { GuestMembershipsService } from './guest-memberships.service';

@Module({
  providers: [GuestMembershipsService],
  exports:[GuestMembershipsService]
})
export class GuestMembershipsModule {}
