import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    if (requiredRoles && requiredRoles.length > 0) {
      const userRoles = user.Roles || [];
      if (!requiredRoles.some(role => userRoles.includes(role))) {
        throw new ForbiddenException('Insufficient role');
      }
    }

    if (requiredPermissions && requiredPermissions.length > 0) {
      const userPermissions = user.Permissions || [];
      if (!requiredPermissions.every(perm => userPermissions.includes(perm))) {
        throw new ForbiddenException('Insufficient permissions');
      }
    }

    return true;
  }
}
