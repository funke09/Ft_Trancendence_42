import { BadRequestException, Body, Controller, Get, Post, Req, Res, SetMetadata, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { FTAuthGuard, JwtAuthGuard } from './utils/Guards';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { SigninDto } from './utils/Signin.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private jwtService: JwtService,
	) {}

	@Get('42')
	@UseGuards(AuthGuard('42'))
	async ftAuth(@Req() req) {}

	@Get('42/redirect')
	@UseGuards(AuthGuard('42'))
	async ftRedirect (@Req() req, @Res({ passthrough: true }) res: Response,) {
		return this.authService.login(req.user, res);
	}

	@Post('signup')
	async signup(
	  @Body('username') username: string,
	  @Body('email') email: string,
	  @Body('password') password: string,
	  @Res({ passthrough: true }) res: Response,
	) {
	  try {
		const token = await this.authService.signup(username, email, password);
		res.cookie('jwt', token, { httpOnly: false, path: '/'});
		return { access_token: token };
	  } catch (error) {
		throw error;
	  }
	}
	

	@Post('signin')
	async signin(
		@Body('username') username: string,
		@Body('password') password: string
	) {
	  try {
		const token = await this.authService.signin(username, password);
		return { access_token: token };
	  } catch (error) {
		throw error;
	  }
	}
}