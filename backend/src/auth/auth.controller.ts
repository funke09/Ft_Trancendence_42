import { Controller, Get, Post, Body, UseGuards, UsePipes, Req, Res, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TradeDto } from './dto/auth.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FToAuthGuard } from './guard/ft.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('42')
  @ApiOperation({ summary: 'ftAuth', description: 'Endpoint to redirect to 42 intar oAuth'})
  @ApiBearerAuth()
  @UseGuards(FToAuthGuard)
  ftAuth(@Req() req){
	return;
  }

  @Get('42/redirect')
  @ApiBearerAuth()
  @UseGuards(FToAuthGuard)
  @ApiOperation({ summary: 'ftAuthCallback', description: 'Endpoint 42oauth service redirect endpoint, returns otp in query to use with 42/trade enpoint'})
  async ftAuthCallback(@Req() req, @Res() res) {
	const code = await this.authService.oAuthLogin(req.user);
	res.redirect(code);
  }

  @Post('42/trade')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Trade 42 oAuth_code and 2FA', description: 'Trade the 42 OAuth code and 2fa code if necessary for a JWT access token'})
  @ApiBody({ type: TradeDto })
  async ftAuthTrade(@Body() body: TradeDto) {
	return await this.authService.oAuthTrade(body.oAuth_code, body.otp_code);
  }
}
