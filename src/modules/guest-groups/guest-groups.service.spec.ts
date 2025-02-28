import { Test, TestingModule } from '@nestjs/testing';
import { GuestGroupsService } from './guest-groups.service';

describe('GuestGroupsService', () => {
  let service: GuestGroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuestGroupsService],
    }).compile();

    service = module.get<GuestGroupsService>(GuestGroupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
