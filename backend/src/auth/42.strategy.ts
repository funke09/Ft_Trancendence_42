import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { Strategy, Profile } from 'passport-42'

@Injectable()
export class FTStartegy extends PassportStrategy(Strategy, '42') {
	constructor(
		private config: ConfigService,
		private authService: AuthService,
	) {
		super({
			clientID: config.get('CLIENT_ID'),
			clientSecret: config.get('CLIENT_SECRET'),
			callbackURL: config.get('CALLBACK_URL'),
			Scope: ['profile', 'email'],
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: Profile) {
		let user = await this.authService.findUser(profile.email[0].value);
		if (!user) {
			await this.authService.signup({
				email: profile.email[0].value,
				username: profile.username,
				password: 'tmpPass',
				avatar: profile._json.image.link,
			});
			user = await this.authService.findUser(profile.email[0].value);
		}
		return user || null;
	}
}