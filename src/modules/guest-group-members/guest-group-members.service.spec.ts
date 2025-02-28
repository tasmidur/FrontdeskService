import { Test, TestingModule } from '@nestjs/testing';
import { GuestGroupMembersService } from './guest-group-members.service';

describe('GuestGroupMembersService', () => {
  let service: GuestGroupMembersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuestGroupMembersService],
    }).compile();

    service = module.get<GuestGroupMembersService>(GuestGroupMembersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
