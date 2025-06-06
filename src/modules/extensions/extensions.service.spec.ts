import { Test, TestingModule } from '@nestjs/testing';
import { ExtensionsService } from './extensions.service';

describe('ExtensionsService', () => {
  let service: ExtensionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExtensionsService],
    }).compile();

    service = module.get<ExtensionsService>(ExtensionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
