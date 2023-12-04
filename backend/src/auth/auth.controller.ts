import {
	Controller,
	Get,
	Req,
	Res,
	UseGuards,
  } from '@nestjs/common';
  import { AuthService } from './auth.service';
  import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
  
  @Controller('auth')
  export class AuthController {
	constructor(
	  private readonly authService: AuthService,
	) {}
  
	@Get('42')
	@UseGuards(AuthGuard('42'))
	async fortyTwoAuth(@Req() req) {}

	@Get('42/callback')
	@UseGuards(AuthGuard('42'))
	async fortyTwoAuthCallback(
		@Req() req,
		@Res ({ passthrough: true }) res: Response,
	) {
		return this.authService.login(req.user, res);
	}
}