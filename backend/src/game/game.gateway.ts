import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { GameService } from './game.service';
import { Socket } from 'socket.io';

@WebSocketGateway({
	cors: {
		origin: "http://localhost:3000",
		credentials: true,
	},
	namespace: 'game',
})
export class GameGateway {
  constructor(private readonly gameService: GameService) {}

  @SubscribeMessage('JOIN')
  matchmaking(client: Socket ): void {
	this.gameService.matchmaking(client);
  }

  @SubscribeMessage('MOVE')
  moveClient(client: Socket, data): void {
	this.gameService.moveClient(client, data);
  }

  async handleDisconnected(client: Socket) {
	this.gameService.handleDisconnected(client);
  }

  async handleConnected(@ConnectedSocket() client: Socket, ...args: any[]) {
	const userData = await this.gameService.getUserData(client);

	if (!userData || userData.is2FA) {
		client.disconnect();
		return;
	}
	this.gameService.init(client, userData.username);
  }

}