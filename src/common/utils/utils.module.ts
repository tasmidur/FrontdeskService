import { Module, Global } from '@nestjs/common';
import { UtilityService } from './utility/utility.service';
@Global()
@Module({
  providers: [UtilityService],
  exports: [UtilityService],
})
export class UtilsModule {}
