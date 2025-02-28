import { Test, TestingModule } from '@nestjs/testing';
import { GuestStayHistoryService } from './guest-stay-history.service';

describe('GuestStayHistoryService', () => {
  let service: GuestStayHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuestStayHistoryService],
    }).compile();

    service = module.get<GuestStayHistoryService>(GuestStayHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
