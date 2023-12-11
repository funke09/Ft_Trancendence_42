import { Injectable, NestMiddleware } from "@nestjs/common"
import { Request, Response, NextFunction } from "express";

@Injectable()
export class AccessControlMiddleware implements NestMiddleware { 
  use(req: Request, res: Response, next: NextFunction) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  }
}