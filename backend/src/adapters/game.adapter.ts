import { IoAdapter } from '@nestjs/platform-socket.io';

export class GameAdapter extends IoAdapter {
  createIOServer(port: number, options?: any): any {
    const server = super.createIOServer(port, options);
    // Handle game-related socket events here
    return server;
  }
}
