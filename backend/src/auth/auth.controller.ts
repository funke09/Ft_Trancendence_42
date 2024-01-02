import { Body, Controller, Get, Param, Post, Put, Req, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from './utils/Guards';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { SetEmailDto, pinDto, setPasswordDto, setUsernameDto } from 'src/user/user.dto';
import { Prisma } from '@prisma/client';


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
	async ftRedirect (@Req() req, @Res({ passthrough: true }) res: Response,) {
		return this.authService.login(req.user, res);
	}

	@Post('signup')
	async signup(
	  @Body() username: setUsernameDto,
	  @Body() email: SetEmailDto,
	  @Body() password: setPasswordDto,
	  @Res({ passthrough: true }) res: Response,
	) {
	  try {
		const token = await this.authService.signup(username.username, email.email, password.password);
		if (token) {
			res.cookie('jwt', token, { httpOnly: false, path: '/'});
			return { access_token: token };
		}
	  } catch (error) {
		throw error;
	  }
	}
	
	@Post('signin')
	async signin(
		@Body('username') username: string,
		@Body('password') password: string,
		@Res({ passthrough: true }) res: Response
	) {
	  try {
		const {token, twoFA} = await this.authService.signin(username, password);
		if (token) {
			if (twoFA)
				return { access_token: token, isTwoFA: twoFA };
			else {
				res.cookie('jwt', token, { httpOnly: false, path: '/'});
				return { access_token: token, isTwoFA: twoFA };
			}
		}
	  } catch (error) {
		throw error;
	  }
	}

	@Put(':id/email')
	async updateEmail(
		@Param('id') id: string,
		@Body('newEmail') newEmail: string,
		) {
		const userId = parseInt(id, 10);
		return this.authService.updateEmail(userId, newEmail);
	}

	@Post('/login2FA')
	async verifyTwoFA(
		@Body() pin: pinDto,
		@Body('token') token: string,
		@Body('username') username: string,
		@Res({ passthrough: true }) res: Response) {
			await this.authService.login2FA(pin.pin, username, token, res);
	}

	@Post('logout')
	async logout(@Res({ passthrough: true }) res: Response) {
		res.clearCookie('jwt');
	}
}