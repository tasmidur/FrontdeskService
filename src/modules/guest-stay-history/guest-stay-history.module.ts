import { Module } from '@nestjs/common';
import { GuestStayHistoryService } from './guest-stay-history.service';

@Module({
  providers: [GuestStayHistoryService],
  exports:[GuestStayHistoryService]
})
export class GuestStayHistoryModule {}
