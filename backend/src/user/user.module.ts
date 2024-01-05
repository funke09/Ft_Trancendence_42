import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { MulterService } from './multer.service';
import { MulterModule } from '@nestjs/platform-express';
import { ChannelService } from './channel.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    AuthModule,
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    PrismaService,
    MulterService,
    ChannelService,
    JwtService,
  ],
  exports: [UserService, MulterService],
})
export class UserModule {}
