import { Body, Controller, Post } from '@nestjs/common';
import { WebhookEventType } from '../../common/enums/subscription_event_names.enum';
import { AppLoggerService } from '../../common/logger/logger.service';
import { SubscriptionEventWebhookService } from '../subscription-event-webhook/subscription-event-webhook.service';
import { CheckInEventWebhookService } from './check-in-event-webhook.service';
import { CheckInDto } from './dto/check-in.dto';

@Controller('check-in-event-webhook')
export class CheckInEventWebhookController {
  constructor(
    private readonly webhookService: CheckInEventWebhookService,
    private readonly logger: AppLoggerService,
    private readonly subscriptionWebhookService: SubscriptionEventWebhookService,
  ) {}

  @Post('CheckIn')
  async postCheckInJazzData(@Body() body: CheckInDto): Promise<any> {
    let reqBodyString = JSON.stringify(body);
    let source = 'Jazz';
    this.logger.log(`Post Call:CheckIn : request : ${reqBodyString}`);
    //business input validation
    if (
      (!body.eventDetails.PropertyUniqueId &&
        !body.eventDetails.BwksGroupId &&
        !body.eventDetails.BwksEnterpriseId) ||
      (body.eventDetails.PropertyUniqueId &&
        body.eventDetails.BwksGroupId &&
        body.eventDetails.BwksEnterpriseId)
    ) {
      return 'Invalid input';
    }
    const saveSubscription =
      this.subscriptionWebhookService.createThirdPartySubscription(
        reqBodyString,
        source,
        WebhookEventType.CheckIn,
      );
    return 'Success';

    let date = new Date();
    if (body.source) {
      source = body.source;
    }
    let propertyId = '';
    if (body.eventDetails.PropertyUniqueId) {
      propertyId = body.eventDetails.PropertyUniqueId;
    } else {
      //to do
    }

    return this.webhookService
      .doReservation(body.eventDetails, propertyId)
      .catch(error => {
        this.logger.log(
          `Error in postCheckInData->doReservation method :${error}`,
        );
        throw error;
      });

    //return this.webhookService.createThirdPartySubscription({Id : body.jazzSubscriptionId, Source : source, SubscriptionData : JSON.stringify(body), CreatedAt : date.toISOString()})

    //return 'saima success'
    //return this.webhookService.postCheckInData(body);
  }
}
