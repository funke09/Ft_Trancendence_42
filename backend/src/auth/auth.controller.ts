import { Body, Controller, Get, HttpCode, Post, Req, Res, SetMetadata, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request, Response } from 'express';
import { signinDTO, signupDTO } from './auth.dto';
import { FTAuthGuard } from './auth.42.guard';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private config: ConfigService,
		private jwtService: JwtService,
		private prisma: PrismaService,
	) {}

	@UseGuards(FTAuthGuard)
	@SetMetadata('isPublic', true)
	@Get('42')
	auth42() {}

	@UseGuards(FTAuthGuard)
	@SetMetadata('isPublic', true)
	@Get('42-redirect')
	async auth42Redirect(@Req() req, @Res({ passthrough: true }) res) {
		if (req.user.isAuth) {
			const { accessToken } = await this.authService.signToken(
				req.user.id,
				req.user.username,
			);
			res.cookie('JWT_TOKEN', accessToken);
			res.redirect("http://localhost:3000/dashboard");
		} else {
			const userToken = await this.jwtService.signAsync({
				sub: -42,
				email: req.user.email,
			});
			res.cookie('USER', userToken);
			res.redirect('http://localhost:3000/auth/signup');
		}
	}

	@SetMetadata('isPublic', true)
	@Get('preAuthData')
	async getPreAuthData(@Req() req) {
		const token = req.cookies['USER'];
		if (!token) throw new UnauthorizedException('Invalid Request');
		try {
			const payload = await this.jwtService.verifyAsync(token, {
				secret: this.config.get('JWT_SECRET'),
			});
			const { email, username, avatar } = await this.authService.findUser(
				payload.emil,
			);
			const user = {
				email,
				username,
				avatar,
			};
			return { user };
		} catch {
			throw new UnauthorizedException();
		}
	}

	@SetMetadata('isPublic', true)
	@Post('finish_signup')
	async finish_signup(
		@Body() dto: signupDTO,
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
	) {
		const userToken = req.cookies['USER'];
		const token = await this.authService.finish_signup(dto, userToken);
		res.cookie('JWT_TOKEN', token.accessToken);
		res.cookie('USER', '', { expires: new Date() });
		return { msg: 'Sucess' };
	}

	@HttpCode(200)
	@SetMetadata('isPublic', true)
	@Post('signin')
	async signin(
		@Body() dto: signinDTO,
		@Res({ passthrough: true }) res: Response,
	) {
		const token = await this.authService.signin(dto);
		res.cookie('JWT_TOKEN', token.accessToken);
		return { token: token };
	}

	@Get('signout')
	logout(@Res({ passthrough: true }) res: Response) {
		res.cookie('JWT_TOKEN', '', { expires: new Date() });
		return { msg: 'Success' };
	}
}
