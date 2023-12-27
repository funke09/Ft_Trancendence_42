import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AuthorisationHeaderMiddleware } from './middleware/header.middleware';
import { AccessControlMiddleware } from './middleware/access.middleware';
import { UserModule } from './user/user.module';
import { GameModule } from './game/game.module';
import { ChatModule } from './chat/chat.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		AuthModule,
		UserModule,
		GameModule,
		ChatModule,
	],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
		 .apply(AuthorisationHeaderMiddleware)
		 .forRoutes(
			'/game/*',
			'/user/*',
			'/chat/*'
		);
		consumer.apply(AccessControlMiddleware).forRoutes('*');
	}
}