import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';

export class EventDetailsDto {
  @ApiPropertyOptional({
    description: 'Unique identifier for the property (UUID)',
    example: '72a144cc-3dcd-4a7e-aa07-e31a47b3f3b5',
    pattern: '^[^.,;?+]*$',
  })
  @IsString()
  @IsOptional()
  @Matches(/^[^.,;?+]*$/, {
    message: 'PropertyUniqueId must not contain .,;?+',
  })
  PropertyUniqueId?: string;

  // @ApiPropertyOptional({
  //   description: 'Enterprise ID from BWKS system',
  //   example: 'ENT456',
  //   pattern: '^[^.,;?+]*$',
  // })
  @IsString()
  @IsOptional()
  @Matches(/^[^.,;?+]*$/, {
    message: 'BwksEnterpriseId must not contain .,;?+',
  })
  BwksEnterpriseId?: string;

  // @ApiPropertyOptional({
  //   description: 'Group ID from BWKS system',
  //   example: 'GRP789',
  //   pattern: '^[^.,;?+]*$',
  // })
  @IsString()
  @IsOptional()
  @Matches(/^[^.,;?+]*$/, { message: 'BwksGroupId must not contain .,;?+' })
  BwksGroupId?: string;

  @ApiProperty({
    description: 'Room number assigned to the guest',
    example: '102',
    pattern: '^[^.,;?+]*$',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[^.,;?+]*$/, { message: 'RoomNumber must not contain .,;?+' })
  RoomNumber: string;

  @ApiProperty({
    description: 'Extension number for the room',
    example: '5002',
    pattern: '^[^.,;?+]*$',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[^.,;?+]*$/, { message: 'ExtensionNumber must not contain .,;?+' })
  ExtensionNumber: string;

  @ApiProperty({
    description: 'Check-in time in mm/dd/yyyy hh:mm:ss (24-hour) format',
    example: '04/09/2025 03:57:37 AM',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(
    /^(0?[1-9]|1[0-2])\/(0?[1-9]|[12]\d|3[01])\/\d{4} (0?[0-9]|1[0-2]):([0-5]\d):([0-5]\d) (AM|PM)$/i,
    {
      message:
        'Invalid datetime format. Use mm/dd/yyyy hh:mm:ss AM/PM (e.g., 04/09/2025 03:57:37 AM).',
    },
  )
  CheckInTime: string;

  @ApiProperty({
    description: 'Unique identifier for the guest',
    example: '565488',
    pattern: '^[^.,;?+]*$',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[^.,;?+]*$/, { message: 'GuestId must not contain .,;?+' })
  GuestId: string;

  @ApiPropertyOptional({
    description: 'Title of the guest (e.g., Mr., Ms.)',
    example: 'Ms.',
    pattern: '^[^,;?+]*$',
  })
  @IsString()
  @IsOptional()
  @Matches(/^[^,;?+]*$/, { message: 'GuestTitle must not contain .,;?+' })
  GuestTitle?: string;

  @ApiProperty({
    description: 'First name of the guest',
    example: 'Leia',
    pattern: '^[^,;?+]*$',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[^,;?+]*$/, { message: 'FirstName must not contain .,;?+' })
  FirstName: string;

  @ApiProperty({
    description: 'Last name of the guest',
    example: 'Organa',
    pattern: '^[^,;?+]*$',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[^,;?+]*$/, { message: 'LastName must not contain .,;?+' })
  LastName: string;

  @ApiPropertyOptional({
    description: 'Type of guest (e.g., G2)',
    example: 'G2',
    pattern: '^[^.,;?+]*$',
  })
  @IsString()
  @IsOptional()
  @Matches(/^[^.,;?+]*$/, { message: 'GuestType must not contain .,;?+' })
  GuestType?: string;

  @ApiPropertyOptional({
    description: 'Code for the group the guest belongs to',
    example: 'REBELGROUP',
    pattern: '^[^.,;?+]*$',
  })
  @IsString()
  @IsOptional()
  @Matches(/^[^.,;?+]*$/, { message: 'GroupCode must not contain .,;?+' })
  GroupCode?: string;

  @ApiPropertyOptional({
    description: 'VIP status of the guest (e.g., 1 for VIP)',
    example: '1',
    pattern: '^[^.,;?+]*$',
  })
  @IsString()
  @IsOptional()
  @Matches(/^[^.,;?+]*$/, { message: 'VipStatus must not contain .,;?+' })
  VipStatus?: string;

  @ApiPropertyOptional({
    description: 'Preferred language of the guest',
    example: 'Alderaanian',
    pattern: '^[^.,;?+]*$',
  })
  @IsString()
  @IsOptional()
  @Matches(/^[^.,;?+]*$/, { message: 'GuestLanguage must not contain .,;?+' })
  GuestLanguage?: string;

  @ApiProperty({
    description: 'Indicates if the guest shares the room (true, false)',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  GuestShare: boolean;

  @ApiProperty({
    description: 'Indicates if data swap is enabled (true, false)',
    example: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  DataSwap: boolean;

  @ApiPropertyOptional({
    description: 'Anticipated check-out date in mm/dd/yyyy format',
    example: '3/25/2021',
    pattern: '^(0?[1-9]|1[0-2])\\/(0?[1-9]|[12]\\d|3[01])\\/\\d{4}$',
  })
  @IsString()
  @IsOptional()
  @Matches(/^(0?[1-9]|1[0-2])\/(0?[1-9]|[12]\d|3[01])\/\d{4}$/, {
    message: 'Invalid datetime format. Use mm/dd/yyyy format.',
  })
  AnticipatedCheckOutTime?: string;
}

export class CheckInDto {
  @ApiProperty({
    description: 'Session ID for the check-in process (UUID)',
    example: 'e1b6a397-aeb6-468b-9467-9b9f5db8f133',
    pattern: '^[^.,;?+]*$',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[^.,;?+]*$/, { message: 'sessionId must not contain .,;?+' })
  sessionId: string;

  @ApiPropertyOptional({
    description: 'Client subscription ID (UUID)',
    example: 'b28532f7-277b-4ac4-8bd7-048b14d6f14a',
    pattern: '^[^.,;?+]*$',
  })
  @IsString()
  @IsOptional()
  @Matches(/^[^.,;?+]*$/, {
    message: 'clientSubscriptionId must not contain .,;?+',
  })
  clientSubscriptionId?: string;

  @ApiProperty({
    description: 'Jazz subscription ID (UUID)',
    example: 'f90fe02e-37a8-4586-81fc-782f8b206208',
    pattern: '^[^.,;?+]*$',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[^.,;?+]*$/, {
    message: 'jazzSubscriptionId must not contain .,;?+',
  })
  jazzSubscriptionId: string;

  @ApiProperty({
    description: 'Transaction ID for the check-in',
    example: '89484395',
    pattern: '^[^.,;?+]*$',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[^.,;?+]*$/, { message: 'transactionId must not contain .,;?+' })
  transactionId: string;

  @ApiPropertyOptional({
    description: 'Source of the check-in request (omitted in example)',
    example: 'PMS',
  })
  @IsString()
  @IsOptional()
  source?: string;

  @ApiProperty({
    description: 'Details of the check-in event',
    type: () => EventDetailsDto,
  })
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => EventDetailsDto)
  eventDetails: EventDetailsDto;
}
