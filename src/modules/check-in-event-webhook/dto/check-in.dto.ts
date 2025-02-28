import { IsString, IsNotEmpty, IsNumberString, IsOptional, IsNumber, IsArray,
    ValidateNested, IsObject, IsBoolean, IsNotEmptyObject, Matches, IsDate, 
    IsUUID, IsJSON, 
    isInt} from 'class-validator';
import { Type,Transform } from 'class-transformer';
import{CommonDto} from '../../../common/dto/commondto'

export class EventDetailsDto {
    @IsString()
    @IsOptional()
    @Matches(/^[^.,;?+]*$/)
    PropertyUniqueId: string;
    
    @IsString()
    @IsOptional()
    @Matches(/^[^.,;?+]*$/)
    BwksEnterpriseId: string;
    
    @IsString()
    @IsOptional()
    @Matches(/^[^.,;?+]*$/)
    BwksGroupId: string;
  
    @IsString()
    @IsNotEmpty()
    @Matches(/^[^.,;?+]*$/)
    RoomNumber: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^[^.,;?+]*$/)
    ExtensionNumber
  
    @IsString()
    @IsNotEmpty()
    @Matches(
        /^(0?[1-9]|1[0-2])\/(0?[1-9]|[12]\d|3[01])\/\d{4} (0[0-9]|1[0-9]|2[0-3]):([0-5]\d):([0-5]\d)$/,
        { message: 'Invalid datetime format. Use mm/dd/yyyy hh:mm:ss in 24-hour format.'  })
    CheckInTime: string;
  
    @IsString()
    @IsNotEmpty()
    @Matches(/^[^.,;?+]*$/)
    GuestId: string;
  
    @IsString()
    @IsOptional()
    @Matches(/^[^,;?+]*$/)
    GuestTitle: string;
  
    @IsString()
    @IsNotEmpty()
    @Matches(/^[^,;?+]*$/)
    FirstName: string;
  
    @IsString()
    @Matches(/^[^,;?+]*$/)
    @IsNotEmpty()
    LastName: string;
  
    @IsString()
    @IsOptional() 
    @Matches(/^[^.,;?+]*$/)  
    GuestType: string;
  
    @IsString()
    @IsOptional()   
    @Matches(/^[^.,;?+]*$/) 
    GroupCode: string;
  
    @IsString()
    @IsOptional()
    @Matches(/^[^.,;?+]*$/)   
    VipStatus : string;
  
    @IsString()
    @IsOptional() 
    @Matches(/^[^.,;?+]*$/)  
    GuestLanguage : string;
  
    @IsString() 
    @IsNotEmpty()
    @Matches(/^(true|false|1|0)$/i, {
        message: 'The value must be one of the following: "true", "True", "false", "False", "1", or "0".',
      })  
    GuestShare : string;
  
    @IsString()  
    @IsNotEmpty() 
    @Matches(/^(true|false|1|0)$/i, {
        message: 'The value must be one of the following: "true", "True", "false", "False", "1", or "0".',
      }) 
    DataSwap  : string;
  
    @IsString()
    @IsOptional()    
    @Matches(
        /^(0?[1-9]|1[0-2])\/(0?[1-9]|[12]\d|3[01])\/\d{4}$/,
        { message: 'Invalid datetime format. Use mm/dd/yyyy format.'  })
    AnticipatedCheckOutTime: string;
}

export class CheckInDto {
    @IsString()
    @IsNotEmpty()
    @Matches(/^[^.,;?+]*$/)
    sessionId: string;
  
    @IsString()
    @IsOptional()
    @Matches(/^[^.,;?+]*$/)
    clientSubscriptionId: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^[^.,;?+]*$/)
    jazzSubscriptionId: string;
  
    @IsString()
    @IsNotEmpty()
    @Matches(/^[^.,;?+]*$/)
    transactionId: string;
  
    @IsString()
    @IsOptional()
    source: string;
  
    @IsObject()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => EventDetailsDto)
    eventDetails: EventDetailsDto;
}