import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient, User } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy
{
  constructor() {
	super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async updateUserEmail(id: number, newEmail: string): Promise<User> {
    return this.user.update({
      where: { id: id },
      data: { email: newEmail },
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

}
