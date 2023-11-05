import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from '../users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UsersService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    const user = await this.userService.verifyUser(email, password);
    if (!user) throw new UnauthorizedException("Invalid User, Not Found.");
    return user
  }
}
