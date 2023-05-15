import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import * as dotenv from 'dotenv';
import { LoginService } from '../../login.service';
import { Inject } from '@nestjs/common';
import { User } from '../../models/user.interface';
dotenv.config();

export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject('LOGIN_SERVICE') private loginService: LoginService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `http://localhost:3000/api/auth/google/callback`,
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const user: User = {
      email: profile.emails[0].value,
      displayName: profile.displayName,
      role: 'user',
    };
    return user;
  }
}
