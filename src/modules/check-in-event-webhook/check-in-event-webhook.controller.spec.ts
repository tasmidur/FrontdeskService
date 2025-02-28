import { Test, TestingModule } from '@nestjs/testing';
import { CheckInEventWebhookController } from './check-in-event-webhook.controller';

describe('CheckInEventWebhookController', () => {
  let controller: CheckInEventWebhookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CheckInEventWebhookController],
    }).compile();

    controller = module.get<CheckInEventWebhookController>(CheckInEventWebhookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
