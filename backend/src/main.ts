import 'dotenv/config'
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { corsMiddleware } from './middlewares/cors.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(corsMiddleware);

  await app.listen(5000);
}

bootstrap();
