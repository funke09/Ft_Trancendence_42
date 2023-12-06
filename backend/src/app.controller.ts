import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/auth.jwt.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
				private readonly authService: AuthService) {}

	@UseGuards(JwtAuthGuard)
	@Get('login')
	async login(@Req() req) {
		return req.user;
	}
}