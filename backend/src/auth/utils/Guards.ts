import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { Observable } from "rxjs";

@Injectable()
export class FTAuthGuard extends AuthGuard('42') {
	async canActivate(context: ExecutionContext) {
		const activate = (await super.canActivate(context)) as boolean;
		const request = context.switchToHttp().getRequest();
		await super.logIn(request);
		return activate;
	}
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class JwtAuthGuardSockets implements CanActivate {
	constructor (private authService: AuthService) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const client = context.switchToWs().getClient();
		const token = client.handshake.headers.token;
		if (!token) {
			return false;
		}
	}
}