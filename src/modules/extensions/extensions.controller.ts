import { Controller, Get, Request } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ExtensionsService } from './extensions.service';
@ApiTags('Extension')
@Controller('extensions')
export class ExtensionsController {
  constructor(private readonly extensionsService: ExtensionsService) {}

  @Get('speed-dial')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Speed-dial extension list' })
  @ApiResponse({
    status: 200,
    description: 'Get Speed-dial extension list',
    example: {
      success: true,
      message: 'Success',
      status: 200,
      data: {
        Id: 'aef7dbe6-185d-4d1e-944f-e6cea1c55d3a',
        GuestName: 'Ms. Leia Organa',
        GuestStatus: 'Checked In',
        PropertyName: 'Hotel Jazz',
        RoomNumber: '102',
        ExtensionNumber: '5002',
      },
      Result: 'Success',
    },
  })
  async getSpeedDialExtensions(@Request() request: any) {
    const speedDialExtensions =
      await this.extensionsService.findSpeedDialExtensions(request);
    const response = speedDialExtensions?.map(_item => {
      return {
        Id: _item?.Id,
        ServiceType: _item.ServiceType,
        ExtensionNumber: _item?.Extension?.ExtensionNumber,
        PropertyName: _item?.Extension?.Property?.Name,
        Department: _item?.Extension?.DepartmentNum,
      };
    });
    return response;
  }
}
