import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { FTStrategy } from './auth.42.strategy';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtStrategy } from './auth.jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: new ConfigService().get('JWT_SECRET'),
      signOptions: { expiresIn: '7d' },
    }),
    PassportModule.register({ defaultStrategy: '42' }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    FTStrategy,
	PrismaService,
	JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
