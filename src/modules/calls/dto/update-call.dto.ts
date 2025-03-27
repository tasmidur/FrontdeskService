// src/calls/dto/create-call.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export enum CallTypeEnum {
  INCOMING = 'Incoming',
  OUTGOING = 'Outgoing',
  MISSED = 'Missed',
}

export enum CallStatusEnum {
  COMPLETED = 'Completed',
  IN_PROGRESS = 'InProgress',
  FAILED = 'Failed',
}

export class UpdateCallDto {
  @ApiProperty({
    description: 'Type of the call',
    enum: CallTypeEnum,
    example: CallTypeEnum.INCOMING,
  })
  @IsEnum(CallTypeEnum)
  CallType: CallTypeEnum;

  @ApiProperty({
    description: 'Status of the call',
    enum: CallStatusEnum,
    example: CallStatusEnum.COMPLETED,
  })
  @IsEnum(CallStatusEnum)
  CallStatus: CallStatusEnum;

  @ApiProperty({
    description: 'Duration of the call in minutes',
    example: 5.5,
  })
  @IsNumber()
  @IsOptional()
  CallDuration: number;

  @ApiProperty({
    description: 'Voicemail message left for the call',
    example: 'Please call me back',
  })
  @IsOptional()
  @IsString()
  VoiceMail: string;

  @ApiProperty({
    description: 'Scheduled date and time for the next wake-up call',
    example: '2025-03-15T08:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  NextWakeUpCall: string;
}
