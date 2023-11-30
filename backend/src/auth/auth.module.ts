import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { FortyTwoStrategy } from './strategies';
import { PrismaService } from '../prisma/prisma.service';
import { SessionSerializer } from './utils/Serialize';

@Module({
  imports: [PassportModule],
  providers: [AuthService, FortyTwoStrategy, PrismaService, SessionSerializer],
  controllers: [AuthController],
})
export class AuthModule {}