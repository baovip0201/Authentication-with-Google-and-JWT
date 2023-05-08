import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
export class JwtStrategyWithRT extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secret',
      passReqToCallback: true,
    });
  }
  async validate(req: Request, payload: any) {
    //console.log(payload);
    const authHeader = req.headers['authorization'];
    const refreshToken = authHeader.split(' ')[1];
    return { refreshToken, ...payload };
  }
}
