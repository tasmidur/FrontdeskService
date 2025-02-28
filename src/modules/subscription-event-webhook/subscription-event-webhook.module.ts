import { Module, Global } from '@nestjs/common';
import { SubscriptionEventWebhookService } from './subscription-event-webhook.service';
@Global()
@Module({
  providers: [SubscriptionEventWebhookService],
  exports:[SubscriptionEventWebhookService]
})
export class SubscriptionEventWebhookModule {}
