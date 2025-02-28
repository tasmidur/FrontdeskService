import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UtilityService } from '../../common/utils/utility/utility.service';

@Injectable()
export class SubscriptionEventWebhookService {
    constructor(private prismaService: PrismaService, 
            private utilityService:UtilityService) {}
    
    async createThirdPartySubscription(thirdPartyRequestBody : string, source : string, eventType : string): Promise<any> {
        return this.prismaService.thirdPartySubscription.create({ 
            data:{
                Id : this.utilityService.generateUuid(),
                CreatedAt : this.utilityService.getCurrentISODate(),
                SubscriptionData : thirdPartyRequestBody,
                Source : source,
                EventType : eventType
            } 
        });
    }

    async updateThirdPartySubscription(updatedSubscription): Promise<any> {
        updatedSubscription.ProcessDate = this.utilityService.getCurrentISODate();
        return this.prismaService.thirdPartySubscription.update({ 
            data: updatedSubscription,  // Pass the processed data
            where: {
                Id: updatedSubscription.Id
            },
        });
    }

    async getUnprocessedThirdPartySubscription(limit : number): Promise<any> {
        const unprocessedData = await this.prismaService.thirdPartySubscription.findMany({ 
            where:{
                ProcessStatus : null
            },
            take: limit, // Limit of records
        });

        await this.prismaService.thirdPartySubscription.updateMany({
            where: { Id: { in: unprocessedData.map((r) => r.Id) } },
            data: { ProcessStatus: 'running' },
        })

        return unprocessedData;
    }
        
            
}
