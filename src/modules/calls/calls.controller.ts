import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CallsService } from './calls.service';
import { CreateCallDto } from './dto/create-call.dto';
import { UpdateCallDto } from './dto/update-call.dto';

@ApiTags('Call')
@Controller('calls')
export class CallsController {
  constructor(private readonly callService: CallsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new call' })
  @ApiResponse({
    status: 201,
    description: 'Call created successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async createCall(
    @Body() callDto: CreateCallDto,
    @Request() request,
  ): Promise<any> {
    return this.callService.create(callDto, request);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update call' })
  @ApiParam({
    name: 'id',
    description: 'The extension number to query',
    example: 'bfefb879-ea1d-4811-bff7-e371089d2b4c',
  })
  @ApiResponse({
    status: 201,
    description: 'Call created successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async updateCall(
    @Param('id') id: string,
    @Body() callDto: UpdateCallDto,
    @Request() request,
  ): Promise<any> {
    return this.callService.update(callDto, id);
  }

  @Get(':extensionNumber/recent')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the most recent calls by extension number' })
  @ApiParam({
    name: 'extensionNumber',
    description: 'The extension number to query',
    example: '5002',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'The page number to retrieve',
    example: 1,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'The number of records to return per page',
    example: 2,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Most recent call retrieved',
  })
  @ApiResponse({ status: 404, description: 'No call found for this extension' })
  async getRecentCall(
    @Param('extensionNumber') extensionNumber: string,
    @Request() request: any,
  ): Promise<any> {
    const calls = await this.callService.getRecentCallsByExtension(
      extensionNumber,
      request,
    );
    const extractedCalls = calls?.data?.map(call => {
      const extension = call.Extension; // Assuming there's only one extension matching the criteria
      const roomExtension = extension?.RoomExtensions[0]; // Assuming there's at least one room extension
      const room = roomExtension?.Rooms; // Assuming there's at least one room
      const guestStayHistory = room?.GuestStayHistory[0]; // Assuming there's at least one guest stay history
      const guest = guestStayHistory?.Guests || call?.Guest;

      return {
        RoomNumber: room?.RoomNo || null,
        PropertyName: request?.user?.ActiveProperty?.Name || null, // Assuming property name is available in the request
        GuestName: guest ? `${guest.FirstName} ${guest.LastName}` : null,
        GuestStatus: guestStayHistory ? 'Checked In' : null, // You can adjust this logic based on your requirements
        ExtensionNumber: extension?.ExtensionNumber || null,
        CallType: call.CallType || null,
        CallStatus: call.CallStatus || null,
        CallDuration: call.CallDuration || null,
        DateTime: call.CreatedAt || null,
      };
    });

    return {
      ...calls,
      data: extractedCalls,
    };
  }

  @Get(':extensionNumber/active')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the active call by extension number' })
  @ApiParam({
    name: 'extensionNumber',
    description: 'The extension number to query',
    example: '5002',
  })
  @ApiResponse({
    status: 200,
    description: 'Most recent call retrieved',
    example: {
      success: true,
      message: 'Success',
      status: 200,
      data: {
        PropertyName: 'Hotel Jazz',
        RoomNumber: '102',
        RoomType: 'Regular',
        RoomStatus: 'Occupied',
        CheckInDate: '2021-03-18T04:00:00.000Z',
        CheckOutDate: null,
        VoiceMail: null,
        NextWakeUpCall: null,
      },
      Result: 'Success',
    }, // example response
  })
  @ApiResponse({ status: 404, description: 'No call found for this extension' })
  async getActiveCall(
    @Param('extensionNumber') extensionNumber: string,
    @Request() request: any,
  ): Promise<any> {
    const activeCallDetails = await this.callService.getActiveCallByExtension(
      extensionNumber,
      request,
    );

    // Early return if there are no active calls
    if (!activeCallDetails || !activeCallDetails.Calls.length) {
      return { message: 'No active calls found.' };
    }

    const { Calls, RoomExtensions, Property } = activeCallDetails;
    const call = Calls[0]; // Assuming there's only one active call
    const room = RoomExtensions[0]?.Rooms || {};

    const response = {
      PropertyName: Property?.Name,
      RoomNumber: room.RoomNo,
      RoomType: room?.RoomType?.RoomTypeName,
      RoomStatus: room?.RoomStatus,
      CheckInDate: room?.GuestStayHistory?.[0]?.ActualCheckedInDate,
      CheckOutDate: room?.GuestStayHistory?.[0]?.ActualCheckedOutDate,
      VoiceMail: call?.VoiceMail,
      NextWakeUpCall: call?.NextWakeUpCall,
    };

    return response;
  }
}
