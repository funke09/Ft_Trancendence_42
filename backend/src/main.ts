import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { AllExceptionFilter } from './exceptions/all.exception.catch';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	
	app.enableCors({
		origin: 'http://localhost:3000',
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		credentials: true,
	});
	
	app.use(cookieParser())
	app.useWebSocketAdapter(new IoAdapter(app));
	app.useGlobalFilters(new AllExceptionFilter());
	await app.listen(5000);
}
bootstrap();
