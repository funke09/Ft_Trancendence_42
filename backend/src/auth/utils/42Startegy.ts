import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport"
import { Strategy, Profile } from 'passport-42';
import { AuthService } from "../auth.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class FTStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly config: ConfigService,
		@Inject('AUTH_SERVICE') private readonly authService: AuthService,
	) {
		super({
			clientID: config.get<string>("CLIENT_ID"),
			clientSecret: config.get<string>("CLIENT_SECRET"),
			callbackURL: 'http://localhost:5000/auth/42/redirect',
			Scope: ['profile', 'email'],
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: Profile) {
		console.log(accessToken);
		console.log(refreshToken);
		console.log(profile);
		let user = await this.authService.findUserByEmail(profile.emails[0].value);
		if (!user) {
			await this.authService.signUser({
				email: profile.emails[0].value,
				username: profile.username,
				password: 'tmpPass',
				avatar: profile._json.image.link,
			});
			user = await this.authService.findUserByEmail(profile.emails[0].value)
		}
		console.log('Validate');
		console.log(user);
		return user || null;
	}
}