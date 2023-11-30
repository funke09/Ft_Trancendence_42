import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('42')
  @UseGuards(AuthGuard('42'))
  async authenticate42(@Req() req, @Res() res) {
    // Passport-42 strategy will handle the authentication
  }

  @Get('42/callback')
  @UseGuards(AuthGuard('42'))
  async authenticate42Callback(@Req() req, @Res() res) {
    // Successful authentication, redirect home or handle as needed
    const user = await this.authService.findOrCreate(req.user);
    // Add logic to handle the user object as needed
    res.redirect('http://localhost:3000/');
  }
}