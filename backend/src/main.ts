import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './exceptions/all.exception.catch';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	
	app.enableCors({
		origin: 'http://localhost:3000',
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		credentials: true,
	});
	
	app.use(cookieParser())
	app.useStaticAssets(join(__dirname, '..', 'uploads'));
	app.useGlobalPipes(new ValidationPipe());
	app.useWebSocketAdapter(new IoAdapter(app));
	app.useGlobalFilters(new AllExceptionFilter());
	await app.listen(5000);
}
bootstrap();
