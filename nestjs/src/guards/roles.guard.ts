import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from 'src/decorators/roles.decorator';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get(Roles, context.getHandler());

    if (!roles) return true;

    const request = context.switchToHttp().getRequest();

    const user = await this.userService.findByEmail(request.user?.email);

    if (!user || !roles.includes(user.role)) {
      throw new UnauthorizedException('Not have permission');
    }
    return true;
  }
}
