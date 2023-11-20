import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';


@WebSocketGateway({ namespace: 'game' })
export class GameGateway {

  queue = [];

  @WebSocketServer()
  server: Server;

  handleConnection(client: any, ...args: any[]) {
    // Handle new connection
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: any) {
    // Handle disconnection
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('join')
  handleJoin(client: any, payload: any): void {
	this.queue.push(client);
	if (this.queue.length >= 2) {
		const player1 = this.queue.shift();
		const player2 = this.queue.shift();
		player1.emit('start', { player: 1 });
		player2.emit('start', { player: 2 });
	}
  }

  @SubscribeMessage('move')
  handleMove(client: any, payload: any): void {
	console.log('move', payload);
  }
}