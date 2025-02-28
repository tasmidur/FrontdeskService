import { IsString, IsNotEmpty, IsNumberString, IsOptional} from 'class-validator';
import{CommonDto} from '../../../common/dto/commondto'

export class ThirdPartySubscriptionDto extends CommonDto{
    @IsOptional()
    Source:string;

    @IsNotEmpty()
    SubscriptionData: string;

    @IsOptional()
    ProcessStatus:string;

    @IsOptional()
    ErrorMessage:string;

    @IsOptional()
    RetryNo:number;
    
    @IsOptional()
    EventType: string

}