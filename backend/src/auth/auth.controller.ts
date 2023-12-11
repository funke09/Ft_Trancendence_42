import { BadRequestException, Controller, Get, Req, Res, SetMetadata, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { FTAuthGuard } from './utils/Guards';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
	) {}

	@SetMetadata('isPublic', true)
	@Get('42')
	@UseGuards(FTAuthGuard)
	handleLogin() {
		return { msg: '42 Intra Authenticated'};
	}

	@SetMetadata('isPublic', true)
	@Get('42/redirect')
	@UseGuards(FTAuthGuard)
	async handleRedirect(@Res() res) {
		// The user is authenticated at this point.
		// You can customize further actions or simply perform a redirect.
		res.redirect('http://localhost:3000/');
	}

	@Get('status')
	@UseGuards(FTAuthGuard)
	async getStats(@Req() req: any) {
		if (!req.user.id) {
			throw new BadRequestException(req.user.id);
		}
		return this.authService.findUser(req.user.id);
	}
}
