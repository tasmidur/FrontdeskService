import { Controller, Get, Param, Request } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RoomsService } from './rooms.service';
@ApiTags('Room')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the list of rooms' })
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
    description: 'Get the list of rooms',
    example: {
      success: true,
      message: 'Success',
      status: 200,
      data: {
        page: 1,
        limit: 10,
        total: 1,
        data: [
          {
            guestName: 'Ms. Leia Organa',
            guestStatus: 'Checked In',
            propertyName: 'Hotel Jazz',
            roomNumber: '102',
            extensionNumber: '5002',
          },
        ],
      },
      Result: 'Success',
    },
  })
  async getAllRooms(@Request() request: any): Promise<any> {
    const rooms = await this.roomsService.getRooms(request);
    const response = rooms?.data?.map(room => {
      const guestStay = room?.GuestStayHistory[0];
      const stayingGuest = guestStay?.StayingGuestDetails[0]?.Guests;
      const extension = room?.RoomExtensions[0]?.Extensions;
      return {
        Id: room?.Id,
        GuestName: stayingGuest
          ? `${stayingGuest.FirstName} ${stayingGuest.LastName}`
          : '',
        GuestStatus: guestStay ? 'Checked In' : '',
        PropertyName: room.RoomType.Property.Name,
        RoomNumber: room.RoomNo,
        ExtensionNumber: extension?.ExtensionNumber || '',
      };
    });

    return {
      ...rooms, // include pagination and other data
      data: response,
    };
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get details' })
  @ApiParam({
    name: 'id',
    description: 'The room id',
    example: 'aef7dbe6-185d-4d1e-944f-e6cea1c55d3a',
  })
  @ApiResponse({
    status: 200,
    description: 'Get details',
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
  async getRoomDetails(@Param('id') id: string): Promise<any> {
    const room = await this.roomsService.getRoom(id);
    const guestStay = room?.GuestStayHistory[0];
    const stayingGuest = guestStay?.StayingGuestDetails[0]?.Guests;
    const extension = room?.RoomExtensions[0]?.Extensions;
    return {
      Id: room?.Id,
      GuestName: stayingGuest
        ? `${stayingGuest.FirstName} ${stayingGuest.LastName}`
        : '',
      GuestStatus: guestStay ? 'Checked In' : '',
      PropertyName: room.RoomType.Property.Name,
      RoomNumber: room.RoomNo,
      ExtensionNumber: extension?.ExtensionNumber || '',
    };
  }
}
