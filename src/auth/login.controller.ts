import {
  Controller,
  Get,
  Req,
  UseGuards,
  Res,
  Inject,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Param,
  Redirect,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoginService } from './login.service';
import { AuthJwt } from './utils/Guards/RoleGuard';
import { Roles } from './role/roles.decorator';
import { Role } from './role/role.enum';
import { JwtStrategy } from './utils/Strategies/JwtStrategy';
import { User } from './models/user.interface';
import { RtGuard } from './utils/Guards/RtGuard';
import { Response } from 'express';

@Controller('')
export class LoginController {
  constructor(@Inject('LOGIN_SERVICE') private loginService: LoginService) {}

  @Post('signup')
  async signUp(@Body() user: User) {
    return await this.loginService.signUp(user);
  }

  @Get('confirmation-user/:token')
  @HttpCode(HttpStatus.OK)
  async confirmationUser(@Param('token') token: string) {
    return await this.loginService.confirmationUser(token);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() user: User) {
    return await this.loginService.signIn(user.username, user.password);
  }

  @Get('refresh-token')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RtGuard)
  async refreshToken(@Req() req) {
    const { userId, refreshToken } = req.user;
    return await this.loginService.refreshToken(userId, refreshToken);
  }

  @Get('auth/google')
  @UseGuards(AuthGuard('google'))
  authGoogle() {
    return { messsage: 'Authentication Google...' };
  }

  @Get('auth/google/callback')
  @UseGuards(AuthGuard('google'))
  async authGoogleCallback(@Req() req, @Res() res: Response) {
    const token = await this.loginService.validateUser(req.user);
    if (token) {
      res.redirect('http://localhost:4200/home/' + token);
    } else {
      res.redirect('http://localhost:4200');
    }
  }

  @Get('auth/twitter')
  @UseGuards(AuthGuard('twitter'))
  authTwitter() {
    return { message: 'Authentication Twitter' };
  }

  @Get('auth/twitter/callback')
  @UseGuards(AuthGuard('twitter'))
  async authTwitterCallback(@Req() req, @Res() res) {
    res.json(req.user);
  }

  // @UseGuards(AuthenticatedGuard)
  @Get('status')
  @Roles(Role.User)
  @UseGuards(AuthGuard('jwt'), AuthJwt)
  user(@Req() req): any {
    const user = req.user;
    return { message: 'Xin chào', user: user };
  }
}
