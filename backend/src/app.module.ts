import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { GameModule } from './game/game.module';
import { AuthMiddleware } from './middleware/header.middleware';
import { AccessControlMiddleware } from './middleware/cors.middleware';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, PrismaModule, ConfigModule.forRoot({ isGlobal: true }), GameModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
		.apply(AuthMiddleware)
		.forRoutes(
			'/user/*',
			'/game/*',
		);
		consumer.apply(AccessControlMiddleware).forRoutes('*');
	}
}