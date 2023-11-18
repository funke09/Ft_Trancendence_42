import { Controller, Get } from '@nestjs/common';

@Controller('api')
export class AppController {
  @Get('hello')
  getHello(): string {
    return 'Hello, World!';
  }
}
