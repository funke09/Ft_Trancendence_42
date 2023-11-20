import { Controller, Get } from '@nestjs/common';
import { users } from './mockData';

@Controller('users')
export class UserController {
  @Get()
  getAllUsers() {
    return users;
  }
}