import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { GameModule } from './game/game.module';
import { AccessControlMiddleware, AuthMiddleware } from './app.middleware';

@Module({
  imports: [AuthModule, PrismaModule, ConfigModule.forRoot({ isGlobal: true }), GameModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
		.apply(AuthMiddleware)
		.forRoutes(
			'/game/*',
		);
		consumer.apply(AccessControlMiddleware).forRoutes('*');
	}
}