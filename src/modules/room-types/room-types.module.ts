import { Module } from '@nestjs/common';
import { RoomTypesService } from './room-types.service';
import { RoomsModule } from './../rooms/rooms.module';

@Module({
  providers: [RoomTypesService],
  exports:[RoomTypesService],
  imports:[RoomsModule]
})
export class RoomTypesModule {}
