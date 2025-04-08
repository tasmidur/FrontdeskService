import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UtilityService } from 'src/common/utils/utility/utility.service';
import { PrismaService } from '../database/prisma.service';
import { IAuthUserResponse } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private utilityService: UtilityService,
  ) {}

  async getAuthUser(email: string): Promise<IAuthUserResponse> {
    const user = await this.prismaService.user.findUnique({
      where: { Email: email }, // Match schema's 'Email'
      include: {
        UserRoles: {
          include: {
            Role: {
              include: {
                Permissions: { include: { Permission: true } },
              },
            },
          },
        },
        UserProperties: {
          include: {
            Property: true,
          },
        },
        UserExtension: {
          include: {
            Extension: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    let extension = {};
    if (user?.UserExtension?.length > 0 && user?.UserExtension[0]?.Extension) {
      const extensionData = user?.UserExtension[0]?.Extension;
      const config =
        JSON.parse(JSON.stringify(extensionData?.Config || {})) || {};
      extension = {
        ...config,
        InstanceId: extensionData.Id,
        Extension: extensionData.ExtensionNumber,
        ContactName: extensionData.ExtensionNumber,
        DisplayName: extensionData.ExtensionNumber,
      };
    }

    // Return user data to be set in request.user
    return {
      Id: user.Id,
      Email: user.Email,
      Roles: user.UserRoles.map(ur => ur.Role?.Name),
      Permissions: user.UserRoles.flatMap(ur =>
        ur.Role?.Permissions?.map(rp => rp.Permission.Name),
      ),
      Properties: user?.UserProperties?.map(up => up.Property) || [], // Include user properties
      ActiveProperty: (user.UserProperties?.find(up => up.IsActive) || {})
        ?.Property, // Include active user properties
      Extension: extension,
    };
  }

  async login(email: string, password: string) {
    const user = await this.prismaService.user.findUnique({
      where: { Email: email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (user && !(await bcrypt.compare(password, user.Password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      Email: user.Email,
      Sub: user.Id,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: '7d',
      }),
    };
  }

  async createUser(
    email: string,
    password: string,
    roleNames: string[] = ['USER'],
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const roles = await this.prismaService.role.findMany({
      where: {
        Name: {
          in: roleNames,
        },
      },
    });
    return this.prismaService.user.create({
      data: {
        Id: this.utilityService.generateUuid(),
        Email: email,
        Password: hashedPassword,
        CreatedAt: this.utilityService.getCurrentISODate(),
        UserRoles: {
          create: roles.map(role => ({
            Id: this.utilityService.generateUuid(),
            RoleId_FK: role.Id,
          })),
        },
      },
    });
  }
}
