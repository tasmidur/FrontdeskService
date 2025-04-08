import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { WebhookEventType } from '../../common/enums/subscription_event_names.enum';
import { AppLoggerService } from '../../common/logger/logger.service';
import { SubscriptionEventWebhookService } from '../subscription-event-webhook/subscription-event-webhook.service';
import { CheckInEventWebhookService } from './check-in-event-webhook.service';
import { CheckInDto } from './dto/check-in.dto';
@ApiTags('Check-In')
@Controller('check-in-event-webhook')
export class CheckInEventWebhookController {
  constructor(
    private readonly webhookService: CheckInEventWebhookService,
    private readonly logger: AppLoggerService,
    private readonly subscriptionWebhookService: SubscriptionEventWebhookService,
  ) {}

  @Post('CheckIn')
  @Public()
  @ApiOperation({ summary: 'Process a guest check-in' })
  @ApiResponse({
    status: 200,
    description: 'Check-in processed successfully',
    example: 'Success',
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async postCheckInJazzData(@Body() body: CheckInDto): Promise<any> {
    let reqBodyString = JSON.stringify(body);
    let source = 'Jazz';
    this.logger.log(`Post Call:CheckIn : request : ${reqBodyString}`);
    //business input validation
    if (
      !body.eventDetails.PropertyUniqueId &&
      !body.eventDetails.BwksGroupId &&
      !body.eventDetails.BwksEnterpriseId
    ) {
      return 'Invalid input';
    }

    this.subscriptionWebhookService.createThirdPartySubscription(
      reqBodyString,
      source,
      WebhookEventType.CheckIn,
    );
    return 'Success';
  }
}
