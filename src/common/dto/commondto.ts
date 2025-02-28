import { IsString, IsUUID } from 'class-validator';

export class CommonDto{
    @IsUUID('4')
    Id: string;

    @IsString()
    CreatedAt : string

}