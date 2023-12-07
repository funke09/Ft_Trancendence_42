import { HttpException, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
	constructor () {}

	use(req: Request, res: Response, next: NextFunction) {
		if (req.headers.authorization === undefined) {
			const jwt = req.cookies.jwt;
			if (jwt) {
				req.headers['authorization'] = `Bearer ${jwt}`;
				next();
				return;
			}
			throw new HttpException('Invalid Authorization in Header', 401);
		}
		next();
	}
}
