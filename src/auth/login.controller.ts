import { Controller, Get, Req, UseGuards, Res, Inject } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoginService } from './login.service';
import { AuthJwt } from './utils/AuthJwt';
import { Roles } from './role/roles.decorator';
import { Role } from './role/role.enum';

@Controller('auth')
export class LoginController {
  constructor(@Inject('LOGIN_SERVICE') private loginService: LoginService) {}
  @Get('google')
  @UseGuards(AuthGuard('google'))
  authGoogle() {
    return { messsage: 'Authentication Google...' };
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async authGoogleCallback(@Req() req, @Res() res) {
    const displayName = req.user.displayName;
    const email = req.user.emails[0].value;
    const jwt = await this.loginService.validateUser({
      displayName: displayName,
      email: email,
    });
    res.json({ message: 'Success', accessToken: jwt });
  }

  // @UseGuards(AuthenticatedGuard)
  @Get('status')
  @Roles(Role.User)
  @UseGuards(AuthJwt)
  user(@Req() req): any {
    const user = req.user;
    return { message: 'Xin chào', user: user };
  }
}
