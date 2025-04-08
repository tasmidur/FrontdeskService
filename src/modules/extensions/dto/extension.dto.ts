import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AssignExtensionDto {
  @ApiProperty({
    required: true,
    description: 'Extesnion Number',
    example: '9001',
  })
  @IsString()
  extensionNumber: string;

  @ApiProperty({
    required: true,
    description: 'UserId',
    example: '3f160d07-7769-480f-b049-dd0ceec1ab15',
  })
  @IsString()
  userId: string;
}
