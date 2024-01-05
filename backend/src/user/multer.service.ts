import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class MulterService {
  constructor(private prisma: PrismaService) {}

  async uploadAvatar(file: Express.Multer.File) {
    if (!file.mimetype.includes('image')) {
      throw new BadRequestException('File is not an image');
    }

    if (file.size > 4 * 1024 * 1024) {
      throw new BadRequestException('File size exceeds 4MB limit');
    }

    const filename = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(__dirname, '..', '..', 'uploads', filename);

    try {
      await fs.writeFile(filePath, await fs.readFile(file.path));
      await fs.unlink(file.path);
    } catch (error) {
      throw new HttpException('Error saving file', 500);
    }

    return filename;
  }

  async saveAvatar(userId: number, filePath: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        avatar: 'http://localhost:5000/' + filePath,
      },
    });
  }
}
