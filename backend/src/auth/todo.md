The issue is in the `createUser` method in your `auth.service.ts` file. You need to add a check to see if a user with the given `username` already exists before trying to create a new one. Here's how you can modify your `createUser` method:

```typescript
async createUser(data: Prisma.UserCreateInput): Promise<User> {
  const existingUser = await this.prisma.user.findUnique({
      where: { username: data.username },
  });

  if (existingUser) {
      throw new BadRequestException('Username is already taken.');
  }

  const hash = await argon.hash(data.password);
  return this.prisma.user.create({
      data: {
          email: data.email,
          username: data.username,
          userStatus: data.userStatus,
          avatar: data.avatar,
          password: hash,	
      },
  });
}
```
This code first checks if a user with the given `username` already exists. If such a user exists, it throws a `BadRequestException`. If not, it proceeds to create the new user.

Please replace the existing `createUser` method with the above code in your `auth.service.ts` file.

<!MakeEdit index="0" startLine="107" endLine="118" file="file:///Users/zcherrad/Desktop/Ft_Trancendence_42/backend/src/auth/auth.service.ts" type="replace" title="Update createUser method" />