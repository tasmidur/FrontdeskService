import { Test, TestingModule } from '@nestjs/testing';
import { CronJobForWebHookService } from './cron-job-for-web-hook.service';

describe('CronJobForWebHookService', () => {
  let service: CronJobForWebHookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CronJobForWebHookService],
    }).compile();

    service = module.get<CronJobForWebHookService>(CronJobForWebHookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
