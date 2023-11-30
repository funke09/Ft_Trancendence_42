import 'dotenv/config'
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import expressSession, * as session from 'express-session';
import * as passport from 'passport';
import { PrismaClient } from '@prisma/client';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';


async function bootstrap() {
	const app = await NestFactory.create(AppModule);
  app.enableCors()
	const config = new DocumentBuilder()
		  .setTitle('Nest API')
		  .setDescription('')
		  .setVersion('1.0')
		  .build();
		  
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('/api', app, document);
	
	
	app.enableCors({
	  origin: ['http://localhost:3000'],
	  credentials: true,
	});
	app.setGlobalPrefix('api');
	app.use(
	  session({
		cookie: {
		  maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
		},
		secret: process.env.COOKIE_SECRET,
		resave: true,
		saveUninitialized: true,
		store: new PrismaSessionStore(
		  new PrismaClient(),
		  {
			checkPeriod: 1000 * 2 * 60,
			dbRecordIdIsSessionId: true,
			dbRecordIdFunction: undefined,
		  }
		  )
		})
		);
		
	app.use(passport.initialize());
	app.use(passport.session());
	await app.listen(5000);
  }
  bootstrap();
