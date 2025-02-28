import { Test, TestingModule } from '@nestjs/testing';
import { GuestGroupsController } from './guest-groups.controller';

describe('GuestGroupsController', () => {
  let controller: GuestGroupsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuestGroupsController],
    }).compile();

    controller = module.get<GuestGroupsController>(GuestGroupsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
