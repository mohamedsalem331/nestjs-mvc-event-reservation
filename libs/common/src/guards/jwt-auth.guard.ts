import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  mixin,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE } from '@app/common/constants/services';
import { Observable, tap, map, catchError, of } from 'rxjs';
import { UserDto } from '../dto';
import { AUTHENTICATE_EVENT } from '../constants';

export const CommonAuthGuardMixin = (byPassJwt: boolean = false) => {
  class CommonJwtAuthGuard implements CanActivate {

    constructor(@Inject(AUTH_SERVICE) readonly authClient: ClientProxy) { }

    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
      if (byPassJwt) return true
      const jwt =
        context.switchToHttp().getRequest().cookies?.Authentication ||
        context.switchToHttp().getRequest().headers?.Authentication;  // cookie parser will inject

      if (!jwt) {
        return false
      }
      return this.authClient
        .send<UserDto>(AUTHENTICATE_EVENT, { Authentication: jwt })
        .pipe(
          tap((res) => {
            context.switchToHttp().getRequest().user = res;
          }),
          map(() => true),
          catchError(() => of(false))
        );

    }
  }
  return mixin(CommonJwtAuthGuard)
}



