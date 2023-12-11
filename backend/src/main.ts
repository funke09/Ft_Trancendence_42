import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as passport from 'passport';
import * as session from 'express-session';
import { ConfigService }  from '@nestjs/config'

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe());
	app.enableCors();
	const configService = app.get(ConfigService);
	
	app.use(
		session({
			secret: configService.get<string>('COOKIE_SECRET'),
			saveUninitialized: false,
		  	resave: false,
		  	cookie: {
				maxAge: 60000 * 100000,
		  	},
		}),
	  );
	app.use(passport.initialize());
	app.use(passport.session());
	await app.listen(5000);
}
bootstrap();
