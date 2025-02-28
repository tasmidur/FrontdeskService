import { Module } from '@nestjs/common';
import { CronJobForWebHookService } from './cron-job-for-web-hook.service';
import { CheckInEventWebhookModule } from '../check-in-event-webhook/check-in-event-webhook.module';
//import { SubscriptionEventWebhookModule } from '../subscription-event-webhook/subscription-event-webhook.module';


@Module({
  imports:[
    CheckInEventWebhookModule,
    //SubscriptionEventWebhookModule,
  ],
  providers: [
    CronJobForWebHookService,    
  ]
})
export class CronJobForWebHookModule {}
