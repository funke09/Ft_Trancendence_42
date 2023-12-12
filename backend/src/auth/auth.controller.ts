import { BadRequestException, Controller, Get, Req, Res, SetMetadata, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { FTAuthGuard, JwtAuthGuard } from './utils/Guards';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';



interface AuthenticatedRequest extends Request {
	user: any; // Replace 'any' with the actual type of your user object
}
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('42')
  @UseGuards(AuthGuard('42'))
  async ftAuth(@Req() req: Request) {
    // If needed, await some asynchronous operations
    // ...
  }

  @Get('42/redirect')
  @UseGuards(AuthGuard('42'))
  async ftRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    // If needed, await some asynchronous operations
    // ...
	return this.authService.login(req.user, res);

  }
}
