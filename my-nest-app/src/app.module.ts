// my-nest-app/src/app.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // Your PostgreSQL server host
      port: 5432, // Your PostgreSQL server port
      username: 'postgres',
      password: 'toor',
      database: 'my_database',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // This option automatically creates database tables on every application launch. Use it in development only.
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

