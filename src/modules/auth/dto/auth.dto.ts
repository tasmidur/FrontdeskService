import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class SingInDto {
  @ApiProperty({
    required: true,
    description: 'Username as email',
    example: 'admin@admin.com',
  })
  @IsEmail()
  username: string;

  @ApiProperty({
    required: true,
    description: 'Password',
    example: '12345678',
  })
  @IsString()
  password: string;
}
