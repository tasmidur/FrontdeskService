import { Module } from '@nestjs/common';
import { ExtensionsService } from './extensions.service';
import { ExtensionsController } from './extensions.controller';

@Module({
  providers: [ExtensionsService],
  exports: [ExtensionsService],
  controllers: [ExtensionsController]
})
export class ExtensionsModule {}
