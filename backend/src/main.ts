import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors({
		origin: 'http://localhost:3000',
		credentials: true,
		methods: [RequestMethod.ALL.toString()],
	});
	console.log("HELLO");
	app.use(cookieParser());
	app.use(passport.initialize());
	app.useWebSocketAdapter(new IoAdapter(app));
	app.useGlobalPipes(new ValidationPipe());
	await app.listen(5000);
}
bootstrap();
