import { Injectable } from '@nestjs/common';
import { UtilityService } from '../../common/utils/utility/utility.service';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ExtensionsService {
  constructor(
    private prismaService: PrismaService,
    private utilityService: UtilityService,
  ) {}

  async getOrCreateWebhookExtension(
    extensionNumber: string,
    propertyId: string,
  ): Promise<any> {
    return this.prismaService.extensions.upsert({
      where: {
        PropertyId_FK_ExtensionNumber: {
          PropertyId_FK: propertyId,
          ExtensionNumber: extensionNumber,
        },
      },
      update: {
        IsActive: 'true',
      },
      create: {
        CreatedAt: this.utilityService.getCurrentISODate(),
        Id: this.utilityService.generateUuid(),
        ExtensionNumber: extensionNumber,
        PropertyId_FK: propertyId,
        IsActive: 'true',
      },
    });
  }

  async findSpeedDialExtensions(request: any): Promise<any> {
    const propertyId = request?.user?.ActiveProperty?.Id;
    const speedDialExtensions =
      await this.prismaService.speedDialExtension.findMany({
        include: {
          Extension: {
            where: {
              PropertyId_FK: propertyId,
            },
            include: {
              Property: true,
            },
          },
        },
      });
    return speedDialExtensions;
  }
}
