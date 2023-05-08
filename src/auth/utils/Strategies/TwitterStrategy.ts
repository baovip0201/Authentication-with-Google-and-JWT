import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-twitter-oauth2.0';

export class TwitterStrategy1 extends PassportStrategy(Strategy, 'twitter') {
  constructor() {
    super({
      clientID: 'OHNoMS01YTBlWmhOSGluZ0l0ME06MTpjaQ',
      clientSecret: 'cxbyIe6Tu5XF7j0cdnDtAntzD-6krA4HWRoJfqyqlfio6WXw75',
      callbackURL: 'http://localhost:3000/api/auth/twitter/callback',
      includeEmail: true,
    });
  }
  async validate(
    accessToken: string,
    requestToken: string,
    profile: any,
    done: any,
  ) {
    console.log(accessToken);
    console.log(profile);
    done(null, profile);
  }
}
