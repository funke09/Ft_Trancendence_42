import { BadRequestException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from 'passport-42';
import { AuthService } from "../auth.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class FTStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: config.get<string>("CLIENT-ID"),
      clientSecret: config.get<string>("CLIENT_SECRET"),
      callbackURL: 'http://localhost:5000/auth/42/redirect',
      scope: ['profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, cb: Function) {
    const user = await this.authService.signUser(profile);
    if (!user) {
      throw new BadRequestException();
    }
    cb(null, user);
  }
}
