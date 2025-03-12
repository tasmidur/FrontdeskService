import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UtilityService } from 'src/common/utils/utility/utility.service';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private utilityService: UtilityService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prismaService.user.findUnique({
      where: { Email: email },
      include: {
        UserRoles: {
          include: {
            Role: {
              include: {
                Permissions: {
                  include: { Permission: true },
                },
              },
            },
          },
        },
      },
    });

    if (user && (await bcrypt.compare(password, user.Password))) {
      const { Password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const roles = user.UserRoles.map(ur => ur.Role.Name);
    const permissions = user.UserRoles.flatMap(ur =>
      ur.Role.Permissions.map(rp => rp.Permission.Name),
    );

    const payload = {
      Email: user.Email,
      Sub: user.Id,
      Roles: roles, // Array of role names
      Permissions: permissions, // Array of permission names
    };

    return {
      AccessToken: this.jwtService.sign(payload),
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
        UserRoles: {
          create: roles.map(role => ({
            Id: this.utilityService.generateUuid(),
            RoleId: role.Id,
          })),
        },
      },
    });
  }
}
