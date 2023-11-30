// auth.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaClient) {}

  async findOrCreate(profile: any): Promise<any> {
    try {
      // Use the `fortytwoId` as the unique identifier for fetching the user
      const user = await this.prisma.user.findUnique({ where: { fortytwoId: profile.id } });

      if (!user) {
        // If the user doesn't exist, create a new user in the database
        const newUser = await this.prisma.user.create({
          data: {
            login: profile.login, // Add this line based on your schema
            fortytwoId: profile.id,
            // Add other properties based on your schema
          },
        });

        return newUser;
      }

      // User already exists, return the existing user
      return user;
    } catch (error) {
      // Handle any database query errors
      throw new Error(`Error finding or creating user: ${error.message}`);
    }
  }
}
