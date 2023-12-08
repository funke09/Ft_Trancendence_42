import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile, VerfiyCallback } from 'passport-42'

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, '42') {
	constructor(private readonly config: ConfigService,)
	{
		super({
			clientID: config.get<string>('CLIENT_ID'),
			clientSecret: config.get<string>('CLIENT_SECRET'),
			callbackURL: 'auth/42/redirect',
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: Profile, cb: VerfiyCallback)
	{
		return cb(null, profile);
	}
}