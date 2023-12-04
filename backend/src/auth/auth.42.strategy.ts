import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-42';
import { AuthService } from './auth.service';

@Injectable()
export class FTStrategy extends PassportStrategy(Strategy, '42') {
	logger: Logger;
  constructor(
    private config: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: config.get('CLIENT_ID'),
      clientSecret: config.get('CLIENT_SECRET'),
      callbackURL: config.get('CALLBACK_URL'),
    });
    this.logger = new Logger('FORTY-TWO-STRATEGY');
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: Function) {
	const user = await this.authService.searchOrCreate(profile);
	if (user == undefined || user == null) {
		throw new BadRequestException();
		}
	done(null, user);
	}
}