import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UtilityService } from '../../common/utils/utility/utility.service';
import { GuestGroupMembersService } from '../guest-group-members/guest-group-members.service';

@Injectable()
export class GuestGroupsService {
    constructor(private prismaService: PrismaService, private utilityService:UtilityService,
        private readonly guestGroupMembersService : GuestGroupMembersService,) {}

    async getOrCreateWebhookGuestGroupAndMember(groupCode, propertyId, guestId, guestShare): Promise<any> {
        let filter  = {
            GuestGroupCode : groupCode,
            PropertyId_FK : propertyId
        };

        return this.prismaService.guestGroups
        .findFirst({
            where : filter
        })
        .then(res=>{
            if(res) return res;
            return this.prismaService.guestGroups.create({
                data:{
                    Id : this.utilityService.generateUuid(),
                    GuestGroupCode : groupCode,            
                    GuestGroupName : groupCode,
                    CreatedAt : this.utilityService.getCurrentISODate(),
                    PropertyId_FK : propertyId
                }})
        })
        .then((grpResult)=>{
            return this.guestGroupMembersService.CreateWebhookGuestGroupMember(grpResult.Id, guestId, guestShare);
        })
    }

}
