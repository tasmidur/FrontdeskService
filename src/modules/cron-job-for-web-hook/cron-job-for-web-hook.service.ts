import { Injectable, OnModuleInit } from '@nestjs/common';
import { AppLoggerService } from '../../common/logger/logger.service';
import { CheckInEventWebhookService } from '../check-in-event-webhook/check-in-event-webhook.service';
import { SubscriptionEventWebhookService } from '../subscription-event-webhook/subscription-event-webhook.service';
import { WebhookEventType } from '../../common/enums/subscription_event_names.enum';
import { plainToInstance } from 'class-transformer';
import { CheckInDto } from '../check-in-event-webhook/dto/check-in.dto';
import { ThirdPartySubscriptionDto } from '../subscription-event-webhook/dto/subscription.dto';
import { ConfigService } from '@nestjs/config';
import { CronJob } from 'cron';
import { SchedulerRegistry } from '@nestjs/schedule';


@Injectable()
export class CronJobForWebHookService implements OnModuleInit{

    constructor(private readonly logger : AppLoggerService,
        private readonly checkInWebhookService : CheckInEventWebhookService,
        private readonly subscriptionWebhookService : SubscriptionEventWebhookService,        
        private readonly configService : ConfigService,
        private readonly schedulerRegistry: SchedulerRegistry,
        ) {}

    onModuleInit() {
        this.handleCronJob();
    }

    handleCronJob() {
        const cronScheduleUnprocessed = this.configService.get<string>('CRON_SCHEDULE_UNPROCESSEDDATA'); 
        const cronScheduleProcessError = this.configService.get<string>('CRON_SCHEDULE_PROCESSERRORDATA'); 
        
        if(!cronScheduleUnprocessed && !cronScheduleProcessError)
        {
            this.logger.log('Cron job was not started as config was not found. ');
            return;
        }

        // Remove existing job if exists
        try {
            this.schedulerRegistry.deleteCronJob('cronJobForUnprocessedData');
        } 
        catch (err) {
        //console.log('No existing cron job found, creating a new one.');
        }
        try{        
            this.schedulerRegistry.deleteCronJob('cronJobForProcessErrorData');
        } 
        catch (err) {
        //console.log('No existing cron job found, creating a new one.');
        }

        // Create and start the cron job
        if(cronScheduleUnprocessed)
        {
            const job = new CronJob(cronScheduleUnprocessed, async () => {
                await this.runWebhookEventService();
            });

            this.schedulerRegistry.addCronJob('cronJobForUnprocessedData', job);
            job.start();

            this.logger.log(`Cron Job Scheduled: ${cronScheduleUnprocessed}`);
        }

        // Create and start the cron job
        if(cronScheduleProcessError) {
            const job = new CronJob(cronScheduleProcessError, async () => {
                    await this.runWebhookEventService();
                });
        
            this.schedulerRegistry.addCronJob('cronJobForProcessErrorData', job);
            job.start();
        
            this.logger.log(`Cron Job Scheduled: ${cronScheduleProcessError}`);
        }
    }

    restartAllCronJobs() {
        console.log('Restarting all cron jobs...');
        this.handleCronJob();
    }

    // Service method to execute within the cron job
    private async runWebhookEventService() {
        try {
            const cronDataLimit = this.configService.get<string>('CRON_DATA_LIMIT', '10'); //default 10 if not set
        
            this.logger.log('Executing runWebhookEventService task...');

            const subscriptionRequests = await this.subscriptionWebhookService.getUnprocessedThirdPartySubscription(Number(cronDataLimit));
        
            // Process each record and handle errors
            const processingData = await Promise.all(
                subscriptionRequests.map(async (data : ThirdPartySubscriptionDto) => {
               try{
                        if(!data) return null;                    
                        switch(data.EventType)
                        {
                            case WebhookEventType.CheckIn :                             
                            return this.processWebhookCheckInData(data);

                            default:
                                return;
                        }
                    }
                    catch(error){
                        this.logger.error(`Error: ThirdPartySubscription Processing error : ${data.SubscriptionData}`,'Schedular');
                        data.RetryNo += 1;
                        return {
                            Id: data.Id,
                            ProcessStatus: 'ErrorOut',
                            RetryNo : data.RetryNo,
                            ErrorMessage : `${data.ErrorMessage} ${data.RetryNo}. ${error.message}`, 
                        };
                    }
                })
            );
            // Step 3: Update the records in the database with success or error status
            const updatePromises = processingData.map((result) =>{
                if(!result) return null;
                return this.subscriptionWebhookService.updateThirdPartySubscription(result);
                }
            );

            // Step 4: Wait for all updates to complete
            await Promise.all(updatePromises);      

            this.logger.log('runWebhookEventService task completed successfully.');
        } 
        catch (error) {
            this.logger.error('Error executing runWebhookEventService task:', error);
        }
    }

    private async processWebhookCheckInData(data : ThirdPartySubscriptionDto) {
        // Parse the received string to JSON
        const jsonObject = JSON.parse(data.SubscriptionData);
            
        // Convert plain object to DTO instance
        const dto = plainToInstance(CheckInDto, jsonObject);
                            
        let propertyId = '';
        if(dto.eventDetails.PropertyUniqueId)
        {
            propertyId = dto.eventDetails.PropertyUniqueId;
        }
        else{
                        //to do
        }

        return this.checkInWebhookService.doReservation(dto.eventDetails, propertyId)
                .then(res=>{
                    return {
                        Id: data.Id,
                        ProcessStatus: 'success',
                        RetryNo : data.RetryNo == 0 ? data.RetryNo : data.RetryNo + 1,  
                    }; 
                });

    }

}
