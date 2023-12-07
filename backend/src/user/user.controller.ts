import { Controller, Get, UseGuards, Res, BadRequestException, Req, Param, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/auth.jwt.guard';
import { AuthService } from 'src/auth/auth.service';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(
	private readonly userService: UserService,
	private readonly authService: AuthService,) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllUsers(@Res() res: Response) {
	res.redirect('/user/profile');
  }

  @UseGuards(JwtAuthGuard)
  @Get('id/:uid')
  async getUserById(@Req() request: any, @Param('uid') uid: number) {
	const user = await this.authService.searchById(request.user.id, +uid);
	if (!user)
		throw new NotFoundException('User not Found');
	return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() request: any) {
	if (!request.user.id){
		throw new BadRequestException('no Username');
	}
	return this.userService.getUserDataById(request.user.id);
  }
}
