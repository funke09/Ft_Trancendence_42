import { Controller, Get, UseGuards, Res, BadRequestException, Req, Param, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(
	private readonly userService: UserService) {}
}
