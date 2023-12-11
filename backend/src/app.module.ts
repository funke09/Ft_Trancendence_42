import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { FTAuthGuard } from './auth/utils/Guards';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		PassportModule.register({ session: true }),
		AuthModule,
		PrismaModule,
	],
})
export class AppModule {}