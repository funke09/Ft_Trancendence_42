import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { FtStrategy, JwtStrategy } from './strategy';
import { UserGateway } from 'src/user/user.gateway';

@Module({
  imports: [JwtModule.register({}), PrismaModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService, JwtService, JwtStrategy, ConfigService, UserGateway, UserService, FtStrategy],
})
export class AuthModule {}
