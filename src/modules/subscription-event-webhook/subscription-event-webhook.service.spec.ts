import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionEventWebhookService } from './subscription-event-webhook.service';

describe('SubscriptionEventWebhookService', () => {
  let service: SubscriptionEventWebhookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubscriptionEventWebhookService],
    }).compile();

    service = module.get<SubscriptionEventWebhookService>(SubscriptionEventWebhookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
