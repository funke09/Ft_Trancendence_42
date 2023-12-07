import { Injectable } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { PrismaService } from "src/prisma/prisma.service";
import { AuthService } from "./auth.service";
import { Strategy, ExtractJwt } from 'passport-jwt'
import { ConfigService } from "@nestjs/config";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService, private AuthService: AuthService, private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: any): Promise<any> {
    if (payload.is2f) {
      return false;
    }
    // return this.AuthService.getUserById(payload.uid);
	return { username: payload.username}
  }
}
