import { CanActivate, ExecutionContext, Injectable, createParamDecorator } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

@Injectable()
export class JwtWsGuard extends AuthGuard('jwt') implements CanActivate {
	constructor(private jwtService: JwtService) {
		super();
		this.jwtService = jwtService;
	}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const req = context.switchToWs().getClient();
		let token = req.handshake.headers.cookie;
		if (token)
			token = token.split('=')[1];
		try {
			req.user = this.jwtService.verify(token, { secret: process.env.JWT_SECRET});
		} catch (e) {
			return false;
		}
		return true;
	}
}

export const UserPayload = createParamDecorator(
	(data: unknown, context: ExecutionContext) => {
		const jwtService = new JwtService();
		const req = context.switchToWs().getClient();
		const token = req.handshake.headers.cookie.split('=')[1];

		const decoded = jwtService.decode(token);
		return decoded;
	}
)