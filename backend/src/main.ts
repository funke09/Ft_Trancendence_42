import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

	const config = new DocumentBuilder()
	.setTitle('ft_trenzenzen')
	.setDescription('Website API')
	.setVersion('0.1')
	.addBearerAuth()
	.build();
	
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);
	
	app.enableCors();
	
	// app.use(cookieParser());
	// app.use(passport.initialize());
	// app.useWebSocketAdapter(new IoAdapter(app));
	await app.listen(5000);
}
bootstrap();
