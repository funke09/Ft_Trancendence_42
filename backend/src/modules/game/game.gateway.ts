import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';

@WebSocketGateway()
export class GameGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly gameService: GameService) {}

  @SubscribeMessage('joinGame')
  handleJoinGame(client: Socket, payload: { gameId: string; playerId: string }) {
    const { gameId, playerId } = payload;
    this.gameService.joinGame(gameId, playerId);
    client.join(gameId);
    this.server.to(gameId).emit('start', { gameId });
  }

  @SubscribeMessage('updateGame')
  handleUpdateGame(client: Socket, payload: { gameId: string; data: any }) {
    const { gameId, data } = payload;
    this.gameService.updateGame(gameId, data);
    this.server.to(gameId).emit('gameData', data);
  }
}
