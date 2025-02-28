import { Controller, Get, Query } from '@nestjs/common';
import { AppLoggerService } from 'src/common/logger/logger.service';
import { GuestsService } from './guests.service';
import { IGuestInfoParams } from './interface/guest.interface';

@Controller('guests')
export class GuestsController {
  constructor(
    private readonly guestService: GuestsService,
    private readonly logger: AppLoggerService,
  ) {}
  @Get('info')
  async getGuestInfo(
    @Query('roomNumber') roomNumber?: string,
    @Query('extensionNumber') extensionNumber?: string,
  ): Promise<any> {
    const filter: IGuestInfoParams = {
      roomNumber,
      extensionNumber,
    };
    this.logger.log(
      `Get Call:guests/info : request : ${JSON.stringify(filter)}`,
    );
    if (!roomNumber && !extensionNumber) {
      return 'Invalid input';
    }
    return await this.guestService.getGuestInfoByRoomNumberOrExtentionNumber(
      filter,
    );
  }
}
