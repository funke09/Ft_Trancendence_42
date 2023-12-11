import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
	imports: [
		AuthModule,
	],
	controllers: [UserController],
	providers: [
		UserService,
		PrismaService,
	],
	exports: [
		UserService,
	],
})
export class UserModule {}
