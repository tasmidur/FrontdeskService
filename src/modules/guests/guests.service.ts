import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UtilityService } from '../../common/utils/utility/utility.service';
import { PrismaService } from '../database/prisma.service';
import { EventDetailsDto } from './../check-in-event-webhook/dto/check-in.dto';
import {
  IGuestInfoParams,
  IGuestInfoResponse,
} from './interface/guest.interface';

@Injectable()
export class GuestsService {
  constructor(
    private prismaService: PrismaService,
    private utilityService: UtilityService,
  ) {}

  async getGuestInfoByRoomNumberOrExtentionNumber({
    roomNumber,
    extensionNumber,
  }: IGuestInfoParams): Promise<IGuestInfoResponse | { error: string }> {
    const result = await this.prismaService.rooms.findFirst({
      where: {
        OR: [
          roomNumber ? { RoomNo: roomNumber } : undefined,
          extensionNumber
            ? {
                RoomExtensions: {
                  some: {
                    Extensions: {
                      ExtensionNumber: extensionNumber,
                    },
                  },
                },
              }
            : undefined,
        ].filter(Boolean),
      },
      include: {
        GuestStayHistory: {
          where: {
            ActualCheckedInDate: { not: null },
            ActualCheckedOutDate: null,
          },
          include: {
            StayingGuestDetails: {
              include: {
                Guests: true,
              },
            },
          },
        },
        RoomType: {
          include: {
            Property: true,
          },
        },
        RoomExtensions: {
          include: {
            Extensions: true,
          },
        },
      },
    });

    if (!result) {
      return {
        error:
          'No room or active stay found for the provided room number or extension number',
      };
    }

    const guestStay = result.GuestStayHistory[0];
    const stayingGuest = guestStay?.StayingGuestDetails[0]?.Guests;
    const extension = result.RoomExtensions[0]?.Extensions;

    return {
      guestName: stayingGuest
        ? `${stayingGuest.FirstName} ${stayingGuest.LastName}`
        : '',
      guestStatus: guestStay ? 'Checked In' : '',
      propertyName: result.RoomType.Property.Name,
      roomNumber: result.RoomNo,
      extensionNumber: extension?.ExtensionNumber || '',
    };
  }
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
    if (!_guestType) {
      _guestType = 'Regular';
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
