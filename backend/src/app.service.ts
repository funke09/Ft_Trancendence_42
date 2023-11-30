import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';


@Injectable()
export class AppService {
	constructor(private prisma : PrismaService) {}
  getHello(): string {
    return 'Hello World!';
  }
  async getUser(){
	return await this.prisma.user.findMany();
  }
}
