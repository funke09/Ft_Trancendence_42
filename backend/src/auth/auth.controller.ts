import { BadRequestException, Controller, Get, Req, Res, SetMetadata, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { FTAuthGuard, JwtAuthGuard } from './utils/Guards';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
	) {}

	@Get('42')
	@UseGuards(AuthGuard('42'))
	async ftAuth(@Req() req) {}

	@Get('42/redirect')
	@UseGuards(AuthGuard('42'))
	async ftRedirect (
		@Req() req,
		@Res({ passthrough: true }) res: Response,
	) {
		return this.authService.login(req.user, res);
	}
}
