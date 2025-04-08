import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AssignExtensionDto } from './dto/extension.dto';
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
      data: [
        {
          Id: '4270fb88-ff05-4d72-a631-d705df16c54b',
          ServiceType: 'Security',
          ExtensionNumber: '00610',
          PropertyName: 'Hotel Jazz',
        },
      ],
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
  @Post('assign-extension-to-user')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Assign extension to user' })
  @ApiResponse({
    status: 200,
    description: 'Assign extension to user',
    example: {
      success: true,
      message: 'Success',
      status: 200,
      data: null, // data is null because we are not returning any data
      Result: 'Success',
    },
  })
  async assignExtension(@Body() body: AssignExtensionDto, @Request() request) {
    await this.extensionsService.assignExtensionToUser(body, request);
    return 'Success';
  }
}
