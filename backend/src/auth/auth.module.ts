import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FTStrategy } from './utils/42Startegy';
import { SessionSerializer } from './utils/Serializer';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtStrategy } from './utils/JwtStrategy';

@Module({
	imports: [PrismaModule],
	controllers: [AuthController],
	providers: [
		JwtStrategy,
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
