import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { genId } from './utils/gen.id';
import { Game } from './game';
import * as jwt from 'jsonwebtoken'
import { ConfigService } from '@nestjs/config';


@Injectable()
export class GameService {
	constructor (private config: ConfigService) {}

	private game = new Map<string, Game> ();
	private readonly players = new Map<string, Socket>();
	private queue : { client: Socket, username: string }[] = [];

	onModuleInit() {}

	async matchmaking(client: Socket) {
		const username = this.getUsernameBySock(client);

		if (!username) return;

		if (this.queue.find((p) => p.username === username)) {
			client.emit('error', `Already in Queue`);
			client.emit('cancel-joining', {});
			return;
		}

		if (this.isInGame(username)) {
			client.emit('error', `Already in Game`);
			client.emit('cancel-joining', {});
			return;
		}

		this.queue.push({ username, client });

		if (this.queue.length >= 2)
		{
			let player1 = this.queue.shift();
			let player2 = this.queue.shift();
			let id = genId(this.game);
			const game = new Game({
				id,
				client1: player1.client,
				client2: player2.client,
				p1Username: player1.username,
				p2Username: player2.username,
				player1Id: (await this.getUserData(player1.client)).uid,
				player2Id: (await this.getUserData(player2.client)).uid,
			});
			game.endCallback = this.stopGame;
			this.game.set(
				id,
				game,
			);
			game.startGame();
		}
	}

	handleDisconnected(client: Socket): void {
		if (!client)
			return;
		let username = this.getUsernameBySock(client);
		if (username)
			return;
		this.players.delete(username);
		this.queue = this.queue.filter((p) => p.username !== username);

		this.players[username] = null;
		this.game.forEach((game) => {
			if (game.p1Username === username)
				game.client1 = null;
			if (game.p2Username === username)
				game.client2 = null;
		});
	}

	moveClient(client: Socket, data): void {
		try {
			let game: Game = this.game.get(data.lobby);
			if (!game)
				return;
			game.move(client, data.move);
		} catch {}
	}

	getUsernameBySock(client: Socket): string | null {
		let username: string | null = null;
		this.players.forEach((value: any, key: string) => {
			if (value.id === client.id)
				username = key;
		});
		return username;
	}

	isInGame(username: string): boolean {
		let isInGame: boolean = false;
		this.game.forEach((game) => {
			if (game.p1Username === username || game.p2Username === username)
				isInGame = true;
		});

		const isInQueue = this.queue.find((p) => p.username === username);

		if (isInQueue) isInGame = true;
		return isInGame;
	}

	async getUserData(client: Socket): Promise<any> {
		let token = null;
		try {
			token = client.handshake.headers.cookie.split('=')[1];
			const underCoded = jwt.verify(token, this.config.get('JWT_SECRET')) as {
				uid: number,
				username: string,
				is2FA: boolean,
				iAt: number,
				eXp: number,
			};
			return underCoded;
		} catch {}

		try {
			const token = client.handshake.headers.jwt as string;
			if (!token)
				return null;
			const underCoded = jwt.verify(token, this.config.get('JWT_SECRET')) as {
				uid: number,
				username: string,
				is2FA: boolean,
				iAt: number,
				eXp: number,
			};
			return underCoded;
		} catch {
			return null;
		}
	}

	public stopGame = (id: string) => {
		const game = this.game.get(id);
		if (!game)
			return;
		this.game.delete(id);
	}

	init(client: Socket, username: string): void {
		this.players.set(username, client);
	}
}
