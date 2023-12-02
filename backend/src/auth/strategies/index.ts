import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-42';
import { AuthService } from '../auth.service';

@Injectable()
export class FTStrategy extends PassportStrategy(Strategy, '42') {
  constructor(
    private config: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: config.get('CLIENT_ID'),
      clientSecret: config.get('CLIENT_SECRET'),
      callbackURL: config.get('CALLBACK_URI'),
      Scope: ['profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    let user = await this.authService.findUser(profile.emails[0].value);
    if (!user) {
      await this.authService.signup({
        id: profile.id,
		email: profile.emails[0].value,
        login: profile.login,
		name: profile.name,
        password: 'tmpPass',
        avatar: profile._json.image.link,
      });
      user = await this.authService.findUser(profile.emails[0].value);
    }
    return user || null;
  }
}
