import { Body, Controller, Get, Post, Redirect, Render, Req, Res, UseGuards, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AUTHENTICATE_EVENT, CurrentUser } from '@app/common';
import { UserDocument } from './users/models/user.schema';
import { Response } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = await this.authService.login(user, response);
    response.send(token);
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern(AUTHENTICATE_EVENT)
  async authenticate(@Payload() data: any) {
    return data.user;
  }

  // views
  @UseGuards(LocalAuthGuard)
  @Post('/connect')
  async connect(@CurrentUser() user: UserDocument, @Body() body, @Req() request, @Res({ passthrough: true }) response: Response,
  ) {
    const token = await this.authService.login(user, response);

    if (token) {
      return response.redirect('http://localhost:3000/reservations/app');
    } else {
      return response.redirect('/auth/signin');
    }
  }

  @Get('/logout')
  @Redirect('/auth')
  logout(@Req() request, @Res() response: Response) {
    response.clearCookie('Authentication')
    return response.redirect('http://localhost:3000/reservations/app');
  }

  @Get('/signin')
  @Render('auth/login')
  signin() {
    const viewData = {}
    return {
      viewData,
    };
  }

}
