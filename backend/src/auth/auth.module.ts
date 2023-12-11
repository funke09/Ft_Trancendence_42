import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { FTStrategy } from './utils/42Startegy';
import { SessionSerializer } from './utils/Serializer';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
	imports: [PrismaModule],
	controllers: [AuthController],
	providers: [
		AuthService,
		FTStrategy,
		SessionSerializer,
		{
			provide: 'AUTH_SERVICE',
			useClass: AuthService,
		}
	],
})
export class AuthModule {}
