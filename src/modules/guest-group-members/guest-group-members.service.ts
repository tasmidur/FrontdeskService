import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UtilityService } from '../../common/utils/utility/utility.service';

@Injectable()
export class GuestGroupMembersService {
    constructor(private prismaService: PrismaService, private utilityService:UtilityService) {}

    async CreateWebhookGuestGroupMember(groupId: string, guestId : string, guestShare : string): Promise<any> {
        
       let data = {
            Id : this.utilityService.generateUuid(),
            GuestGroupId_FK : groupId,            
            GuestId_FK : guestId,
            CreatedAt : this.utilityService.getCurrentISODate(),
            GuestShare : guestShare,
            IsPrimaryGuest : 'true'
        };
        return this.prismaService.guestGroupMembers.create({data})
    }


}
