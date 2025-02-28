import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UtilityService } from '../../common/utils/utility/utility.service';

@Injectable()
export class GuestMembershipsService {
    constructor(private prismaService: PrismaService, private utilityService:UtilityService) {}

    async registerWebhookGuestMembership(membershipType: string, guestId : string): Promise<any> {
        return this.prismaService.guestMembership.findFirst({
            where : {           
                Guest_Id : guestId,
                TierLevel : membershipType
            }
        })
        .then(res=>{
            if(res) return res;
            return this.prismaService.guestMembership.create({
                data:{
                    Id : this.utilityService.generateUuid(),
                    Guest_Id : guestId,
                    TierLevel : membershipType,
                    IsActive : 'true'
                }
            })
        })
    }
}
