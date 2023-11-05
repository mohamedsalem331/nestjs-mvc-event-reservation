import { Body, Controller, Post, Get, UseGuards, Render, Req, Res } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { CurrentUser } from '../../../../libs/common/src/decorators/current-user.decorator';
import { UserDocument } from './models/user.schema';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Response, Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) { }

  @Post('/connect')
  @Render('auth/register')
  async createUser(@Body() createUserDto: CreateUserDto, @Req() request: Request, @Res({ passthrough: true }) response: Response) {
    console.log(createUserDto);

    const newUser = await this.userService.create(createUserDto);
    if (newUser) {
      return response.redirect('/auth/signin');
    } else {
      return response.redirect('/auth/signup');
    }
  }

  @Get('/signup')
  @Render('auth/register')
  signup() {
    const viewData = {}
    return {
      viewData,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUser(@CurrentUser() user: UserDocument) {
    return user;
  }
}
