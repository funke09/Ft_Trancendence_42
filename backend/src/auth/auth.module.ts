import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { APP_GUARD } from '@nestjs/core';
import { FTStartegy } from './42.strategy';
import { FTAuthGuard } from './auth.42.guard';
import { AuthGuard } from './auth.jwt.guard';

@Module({
	imports: [
		JwtModule.register({
			global: true,
			secret: new ConfigService().get('JWT_SECRET'),
			signOptions: { expiresIn: '7d' },
		}),
		PassportModule.register({ session: false }),
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
		FTAuthGuard,
		FTStartegy,
	],
})

export class AuthModule {}
