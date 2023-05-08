import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../role/role.enum';
import { ROLES_KEY } from '../../role/roles.decorator';

@Injectable()
export class AuthJwt implements CanActivate {
  constructor(private reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requireRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest();
    try {
      const payload = request['user'];
      if (!requireRoles) return true;
      return requireRoles.some((role) => role === payload.role);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
