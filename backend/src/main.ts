import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { users, scores } from './mockData';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Express app instance
  const expressApp = express();

  // API endpoint to get users
  expressApp.get('/api/users', (req, res) => {
    res.json(users);
  });

  // API endpoint to get scores
  expressApp.get('/api/scores', (req, res) => {
    res.json(scores);
  });

  // Set up Nest to use Express
  app.use(expressApp);
  
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(3069);
}
bootstrap();
