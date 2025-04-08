import { Injectable } from '@nestjs/common';
import { UtilityService } from '../../common/utils/utility/utility.service';
import { PrismaService } from '../database/prisma.service';
import { AssignExtensionDto } from './dto/extension.dto';

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

  async assignExtensionToUser(requestBody: AssignExtensionDto, request: any) {
    const extensionNumber = requestBody.extensionNumber;
    const propertyId = request?.user?.ActiveProperty?.Id;
    const userId = requestBody.userId;
    // Find the extension by ExtensionNumber and PropertyId_FK
    const extension = await this.prismaService.extensions.findUnique({
      where: {
        PropertyId_FK_ExtensionNumber: {
          PropertyId_FK: propertyId,
          ExtensionNumber: extensionNumber,
        },
      },
    });

    if (!extension) {
      throw new Error(`Extension with number ${extensionNumber} not found`);
    }

    const extensionId = extension.Id;

    // Check if the extension is already assigned to any user
    const existingAssignment = await this.prismaService.userExtension.findFirst(
      {
        where: {
          ExtensionId_FK: extensionId,
        },
        include: {
          User: true, // Optional: include user details for verification
        },
      },
    );

    // If the extension is assigned to a different user, throw an error
    if (existingAssignment && existingAssignment.UserId_FK !== userId) {
      throw new Error(
        `Extension ${extensionNumber} (ID: ${extensionId}) is already assigned to user ${existingAssignment.UserId_FK}`,
      );
    }
    console.log(userId, extensionId);
    // Perform upsert to either create new assignment or update existing one
    const userExtension = await this.prismaService.userExtension.upsert({
      where: {
        UserId_FK_ExtensionId_FK: {
          UserId_FK: userId,
          ExtensionId_FK: extensionId,
        },
      },
      update: {
        UpdatedAt: this.utilityService.getCurrentISODate(),
        // You could add more fields to update if needed
      },
      create: {
        Id: this.utilityService.generateUuid(),
        UserId_FK: userId,
        ExtensionId_FK: extensionId,
        CreatedAt: this.utilityService.getCurrentISODate(),
      },
    });

    console.log(
      `Successfully assigned extension ${extensionNumber} (ID: ${extensionId}) to user ${userId}`,
    );
    return userExtension;
  }
}
