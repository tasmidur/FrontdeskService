import { Test, TestingModule } from '@nestjs/testing';
import { CheckInEventWebhookService } from './check-in-event-webhook.service';

describe('CheckInEventWebhookService', () => {
  let service: CheckInEventWebhookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CheckInEventWebhookService],
    }).compile();

    service = module.get<CheckInEventWebhookService>(CheckInEventWebhookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
