import { BadRequestException, Controller, Get, HttpException, NotFoundException, Param, ParseIntPipe, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/utils/Guards';
import { AuthService } from 'src/auth/auth.service';
import { Response } from 'express';

@Controller('user')
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly authService: AuthService,
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
		return this.userService.getUserDataById(req.user.id);
	}

	@UseGuards(JwtAuthGuard)
	@Get('/id/:userId')
	async getUserById(@Req() req: any, @Param('userId') userId: number) {
		const user = await this.userService.getUserById(req.user.id, +userId)
		if (!user) throw new NotFoundException("User not Found");
		return user;

	}

	@UseGuards(JwtAuthGuard)
	@Get('/:username')
	async getUserByUsername(@Param('username') username: string) {
		if (!username)
			throw new BadRequestException('Missing username');
		return await this.userService.findUserByUsername(username);
	}

	@UseGuards(JwtAuthGuard)
	@Get('/avatar/:id')
	async getAvatar(
		@Param('id', ParseIntPipe) id: number,
		@Res() res: Response,
	) {
			return await this.userService.getAvataById(id);
	}

	@UseGuards(JwtAuthGuard)
	@Get('/getStats/:id')
	async getStats(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
		if (!req.user.id) throw new BadRequestException('Missing username');
		return this.userService.getStatsById(id);
	}
}
