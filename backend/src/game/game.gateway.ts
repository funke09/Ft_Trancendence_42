import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { GameService } from './game.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: 'http://localhost:3000', credentials: true },
  namespace: 'game',
})
export class GameGateway {
  constructor(private readonly gameService: GameService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('createGame')
  createGame(client: Socket, data: { gameType: number }): void {
    this.gameService.createGame(client, data);
  }

  @SubscribeMessage('cancelGame')
  cancelGame(client: Socket): void {
    this.gameService.cancelGame(client);
  }

  @SubscribeMessage('moveGame')
  moveGame(client: Socket, data: any): void {
    this.gameService.moveGame(client, data);
  }

  @SubscribeMessage('invGame')
  invGame(client: Socket, data: { username: string; gameType: number }): void {
    this.gameService.invGame(client, data);
  }

  @SubscribeMessage('leftGame')
  leftGame(client: Socket): void {
    this.gameService.leftGame(client);
  }

  @SubscribeMessage('acceptGame')
  acceptGame(client: Socket, data: { username: string }): void {
    this.gameService.acceptGame(client, data);
  }

  @SubscribeMessage('cancelInvGame')
  cancelInvGame(client: Socket, data: { username: string }): void {
    this.gameService.cancelInvGame(client, data);
  }

  @SubscribeMessage('rejectInvGame')
  rejectInvGame(client: Socket, data: { username: string }): void {
    this.gameService.rejectInvGame(client, data);
  }

  @SubscribeMessage('leaveGame')
  leaveGame(client: Socket): void {
    this.gameService.leaveGame(client);
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    const user = await this.gameService.getUser(client);
    if (!user) {
      client.disconnect();
      return;
    }
    this.gameService.initGame(client, user.username);
  }

  async handleDisconnect(client: Socket) {
    this.gameService.disconnectGame(client);
  }
}
