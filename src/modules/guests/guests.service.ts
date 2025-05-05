import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UtilityService } from '../../common/utils/utility/utility.service';
import { PrismaService } from '../database/prisma.service';
import { EventDetailsDto } from './../check-in-event-webhook/dto/check-in.dto';

@Injectable()
export class GuestsService {
  constructor(
    private prismaService: PrismaService,
    private utilityService: UtilityService,
  ) {}

  async updateOrCreateWebhookGuest(
    guest: EventDetailsDto,
    propertyId: string,
  ): Promise<any> {
    let result;
    let _guest;

    let _guestType = guest.VipStatus;
    if (!_guestType) {
      _guestType = 'Regular';
    }

    return this.prismaService.guests
      .findFirst({
        where: { GuestCode: guest.GuestId },
      })
      .then(result => {
        if (result) {
          return this.prismaService.guests.update({
            where: { Id: result.Id },
            data: {
              GuestType: _guestType,
              LastVisitedDate: this.utilityService.getCurrentISODate(),
              NumberOfVisits: result.NumberOfVisits + 1,
              UpdatedAt: this.utilityService.getCurrentISODate(),
            },
          });
        } else {
          return this.prismaService.guests.create({
            data: {
              Id: this.utilityService.generateUuid(),
              FirstName: `${guest.GuestTitle} ${guest.FirstName}`,
              GuestType: _guestType,
              LastName: guest.LastName,
              CreatedAt: this.utilityService.getCurrentISODate(),
              GuestCode: guest.GuestId,
              Language: guest.GuestLanguage,
              LastVisitedDate: this.utilityService.getCurrentISODate(),
              NumberOfVisits: 1,
            },
          });
        }
      });
  }

  async getOrCreateWebhookGuestWithTransaction(
    tx: Prisma.TransactionClient,
    guest: EventDetailsDto,
    propertyId: string,
  ): Promise<any> {
    let result;
    let _guest;

    let _guestType = guest.VipStatus;
    //TODO: A code indicating VIP status – the value varies based on PMS, need to map with pms and code wise naming
    if (!_guestType) {
      _guestType = 'Regular';
    } else {
      _guestType = 'Vip';
    }

    return tx.guests
      .findFirst({
        where: { GuestCode: guest.GuestId },
      })
      .then(result => {
        if (result) {
          return this.prismaService.guests.update({
            where: { Id: result.Id },
            data: {
              GuestType: _guestType,
              LastVisitedDate: this.utilityService.getCurrentISODate(),
              NumberOfVisits: result.NumberOfVisits + 1,
              UpdatedAt: this.utilityService.getCurrentISODate(),
            },
          });
        } else {
          return this.prismaService.guests.create({
            data: {
              Id: this.utilityService.generateUuid(),
              FirstName: `${guest.GuestTitle} ${guest.FirstName}`,
              GuestType: _guestType,
              LastName: guest.LastName,
              CreatedAt: this.utilityService.getCurrentISODate(),
              GuestCode: guest.GuestId,
              Language: guest.GuestLanguage,
              LastVisitedDate: this.utilityService.getCurrentISODate(),
              NumberOfVisits: 1,
            },
          });
        }
      });
  }

  async getGuestDashboardData(
    propertyId: string,
    offset: number,
    limit: number,
  ): Promise<any> {}
}
