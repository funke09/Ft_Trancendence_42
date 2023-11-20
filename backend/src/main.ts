// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as http from 'http';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { GameAdapter } from './adapters/game.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const server = http.createServer(app.getHttpAdapter().getInstance());
  app.useWebSocketAdapter(new GameAdapter(server));
  await app.listen(3069);
}

bootstrap();
