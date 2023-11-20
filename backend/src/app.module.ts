import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameGateway } from './game.gateway';
import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AccessControllerMiddleware } from './access.controller.middleware';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, GameGateway],
})

export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
	  consumer.apply(AccessControllerMiddleware).forRoutes('*');
	}
  }
