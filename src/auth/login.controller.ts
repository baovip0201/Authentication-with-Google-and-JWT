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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoginService } from './login.service';
import { AuthJwt } from './utils/Guards/RoleGuard';
import { Roles } from './role/roles.decorator';
import { Role } from './role/role.enum';
import { JwtStrategy } from './utils/Strategies/JwtStrategy';
import { User } from './models/user.interface';
import { RtGuard } from './utils/Guards/RtGuard';

@Controller('')
export class LoginController {
  constructor(@Inject('LOGIN_SERVICE') private loginService: LoginService) {}

  @Post('signup')
  async signUp(@Body() user: User) {
    return await this.loginService.signUp(user);
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
  async authGoogleCallback(@Req() req, @Res() res) {
    // const displayName = req.user.displayName;
    // const email = req.user.emails[0].value;
    // const jwt = await this.loginService.validateUser({
    //   displayName: displayName,
    //   email: email,
    // });
    // res.json({ message: 'Success', accessToken: jwt });
    res.json({ message: 'Success', accessToken: req.user });
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
