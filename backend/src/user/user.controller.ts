import { BadRequestException, Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/utils/Guards';
import { Response } from 'express';

@Controller('user')
export class UserController {
	constructor(
		private readonly userServicec: UserService,
	) {}

	@Get()
	@UseGuards(JwtAuthGuard)
	async getAllUser(@Res() res: Response) {
		res.redirect('user/profile');
	}

	@UseGuards(JwtAuthGuard)
	@Get('profile')
	async getProfile(@Req() req: any) {
		if (!req.user.id)
			throw new BadRequestException(req.user.id);
		return this.userServicec.getUserDataById(req.user.id);
	}
}
