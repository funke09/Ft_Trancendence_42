import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import { AllExceptionFilter } from './exceptions/all.exception.catch';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	
	app.enableCors({
		origin: 'http://localhost:3000',
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		credentials: true,
	});
	
	app.use(cookieParser())
	app.useGlobalFilters(new AllExceptionFilter());
	await app.listen(5000);
}
bootstrap();
