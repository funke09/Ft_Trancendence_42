import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserDataById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
    });

    if (user) {
      return user;
    }

    throw new NotFoundException(`User with ID ${id} not found`);
  }
}
