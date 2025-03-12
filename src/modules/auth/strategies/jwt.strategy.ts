import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'), // Get secret from env
    });
  }

  async validate(payload: any) {
    return {
      UserId: payload.Sub,
      Email: payload.Email,
      Roles: payload.Roles, // Array of roles
      Permissions: payload.Permissions, // Array of permissions
    };
  }
}
