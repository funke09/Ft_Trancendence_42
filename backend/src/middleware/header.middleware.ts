import {
	HttpException,
	Injectable,
	NestMiddleware,
  } from '@nestjs/common';
  import { NextFunction, Response, Request } from 'express';
  
  @Injectable()
  export class AuthorisationHeaderMiddleware implements NestMiddleware {
  
	use(req: Request, next: NextFunction) {
	  if (req.headers.authorization === undefined) {
		const jwt = req.cookies.jwt;
		if (jwt) {
		  req.headers['authorization'] = `Bearer ${jwt}`;
		  next();
		  return;
		}
		throw new HttpException('NO Authorisation in the header', 401);
	  }
	  next();
	}
  }
  