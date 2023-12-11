import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthorisationHeaderMiddleware } from './middleware/header.middleware';
import { AccessControlMiddleware } from './middleware/access.middleware';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		AuthModule,
		PrismaModule,
	],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
		 .apply(AuthorisationHeaderMiddleware)
		 .forRoutes(
			'/game/*',
		);
		consumer.apply(AccessControlMiddleware).forRoutes('*');
	}
}