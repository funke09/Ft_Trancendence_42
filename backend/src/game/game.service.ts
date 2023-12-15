import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { InvGameDto } from './dto/inv-game.dto';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { genID } from './utils/genID';
// import { Game } from './game';

@Injectable()
export class GameService {
	constructor(private readonly config: ConfigService) {}
	
	private games = new Map<string, Game>();
	private queue : {client : Socket, username: string}[] = [];
	private readonly players = new Map<string, Socket>();
	private invits : InvGameDto[] = [];

	async createGame(client: Socket) {
		const username = this.getUsernameBySocket(client);

		if (!username) return;

		if (this.queue.find((p) => p.username === username)) {
			client.emit('error', 'Already in Queue Dummy');
			client.emit('cancelGame', []);
			return;
		}
		
		if (this.isInGame(username)) {
			client.emit('error', 'Already in-game Dummy');
			client.emit('cancelGame', []);
			return;
		}

		this.queue.push({ username, client });

		if (this.queue.length >= 2) {
			let p1 = this.queue.shift();
			let p2 = this.queue.shift();
			let id = genID(this.games);

			const game = new Game({
				id,
				client1: p1.client,
				client2: p2.client,
				p1Username: p1.username,
				p2Username: p2.username,
				p1Id: (await this.getUser(p1.client)).uid,
				p2Id: (await this.getUser(p2.client)).uid,
			});
			game.endGameCallback = this.stopGame;
			this.games.set(
				id,
				game,
			);
			game.startGame();
		}
	}

	cancelGame(client: Socket): void {
		const username = this.getUsernameBySocket(client);
		this.queue = this.queue.filter((p) => p.username !== username);
	}

	moveGame(client: Socket, data): void {
		try {
			let game: Game = this.games.get(data.room);
			if (!game) return;
			game.move(client, data.move);
		} catch (error) {}
	}

	async invGame(fromClient: Socket, data: {username: string}) {
		if (!data.username) return;
		const fromUsername = this.getUsernameBySocket(fromClient);
		if (!fromUsername) return;

		if (this.isInGame(data.username)) {
			fromClient.emit('error', `${data.username} is Already in a game`);
			fromClient.emit('canceledInvGame', {});
			return;
		}

		if (this.isInGame(fromUsername)) {
			fromClient.emit('error', 'You Already in a game');
			fromClient.emit('canceledInvGame', {});
			return;
		}

		const toClient = this.players.get(data.username);
		if (!toClient) {
			fromClient.emit('error', `${data.username} is not connected`);
			fromClient.emit('canceledInvGame', {});
			return;
		}

		this.invits.push({
			from: fromUsername,
			to: data.username,
			time: new Date(),
		});

		setTimeout(() => {
			this.invits = this.invits.filter((i) => i.from !== fromUsername && i.to !== data.username);

		}, 15 * 1000);

		const userId = (await this.getUser(fromClient)).uid;
		toClient.emit('invite', {username: fromUsername, id: userId});
	}

	async acceptGame(toClient: Socket, data: { username: string }) {
		if (!data.username) return;
		const fromClient = this.players.get(data.username);
		if (!fromClient) {
			toClient.emit('error', `${data.username} is no longer Online`);
			return;
		}
		const toUsername = this.getUsernameBySocket(toClient);
		const invite = this.invits.find((i) => i.from === data.username && i.to === toUsername);
		if (!invite) {
			toClient.emit('error', `No invites from ${data.username}`);
			return;
		}

		this.invits.splice(this.invits.indexOf(invite), 1);
		fromClient.emit('invite-accepted', {});
		toClient.emit('invite-accepted', {});
		const id = genID(this.games);
		const game = new Game({
			id,
			client1: fromClient,
			client2: toClient,
			p1Username: data.username,
			p2Username: toUsername,
			p1Id: (await this.getUser(fromClient)).uid,
			p2Id: (await this.getUser(toClient)).uid,
		});

		game.endGameCallback = this.stopGame;

		this.games.set(
			id,
			game,
		);
		game.startGame();
	}

	cancelInvGame(client: Socket, data: { username: string }): void {
		if (!data.username) return;
		const fromUsername = this.getUsernameBySocket(client);
		if (!fromUsername) return;

		this.invits = this.invits.filter((i) => i.from !== fromUsername && i.to !== data.username);
		const toClient = this.players.get(data.username);
		const fromClient = this.players.get(fromUsername);
		if (toClient) toClient.emit('invite-canceled', {});
		if (fromClient) fromClient.emit('invite-canceled', {});
	}

	rejectInvGame(toClient: Socket, data: {username: string }): void {
		if (!data.username) return;
		const fromUsername = this.getUsernameBySocket(toClient);
		if (!fromUsername) return;

		this.invits = this.invits.filter((i) => i.from !== fromUsername && i.to !== data.username);
		const fromClient = this.players.get(data.username);
		if (toClient) toClient.emit('invite-canceled', {});
		if (fromClient) fromClient.emit('invite-canceled', {}); 
	}

	initGame(client: Socket, username: string): void {
		this.players.set(username, client);

		if (this.handleInGame(username, client))
			console.log(`Player ${username} reconnected to previous game`);
		else
			console.log(`Player ${username} connected`);
	}

	leftGame(client: Socket): void {
		const username = this.getUsernameBySocket(client);
		if (!username) {
			client.emit('error', 'Something wrong');
		}

		if (this.handleInGame(username, client))
			console.log(`Player ${username} reconnected to previous game`);
	}

	disconnectGame(client: Socket): void {
		if (!client) return;
		let username = this.getUsernameBySocket(client);
		if (username) return;

		this.players.delete(username);

		this.queue = this.queue.filter((p) => p.username !== username);

		this.players[username] = null;
		this.games.forEach((game) => {
			if (game.p1Username === username)
				game.client1 = null;
			if (game.p2Username === username)
				game.client2 = null;
		});

		this.invits = this.invits.filter((i) => i.from !== username && i.to !== username);
	}

	getUsernameBySocket(client: Socket): string | null {
		let username: string | null = null;
		this.players.forEach((value: any, key: string) => {
			if (value.id === client.id) {
				username = key;
			}
		});
		return username;
	}

	async getUser(client: Socket): Promise<any> {
		let token = null;
		try {
			token = client.handshake.headers.cookie.split('=')[1];
			const unedrCoded = jwt.verify(token, this.config.get("JWT_SECRET")) as {
				uid: number,
				username: string,
				iat: number,
				exp: number;
			};
			return unedrCoded;
		} catch {}

		try {
			const token = client.handshake.headers.jwt as string;
			if (!token) return null;
			const unedrCoded = jwt.verify(token, this.config.get("JWT_SECRET")) as {
				uid: number,
				username: string,
				iat: number,
				exp: number;
			};
			return unedrCoded;
		} catch {
			return null;
		}
	}

	handleInGame(username: string, client: Socket): boolean {
		let game: Game | undefined;
		this.games.forEach((value: Game, key: string) => {
			if (value.p1Username === username || value.p2Username === username)
				game = value; 
		});
		if (game) {
			game.reconnectPlayer(username, client);
			return true;
		}
		return false;
	}

	public stopGame = (id: string) => {
		const game = this.games.get(id);
		if (!game) {
			console.warn(`Game '${id}' cannot be stopped`);
			return;
		}
		this.games.delete(id);
	}

	isInGame(username: string): boolean {
		let isInGame: boolean = false;
		this.games.forEach((game) => {
			if (game.p1Username === username || game.p2Username === username)
				isInGame = true;
		});

		const isInQueue = this.queue.find((p) => p.username === username);

		if (isInQueue) isInGame = true;
		return isInGame;
	}

	leaveGame(client: Socket): void {
		const username = this.getUsernameBySocket(client);
		if (!username) return;
		let game: Game | undefined;
		this.games.forEach((value: Game, key: string) => {
			if (value.p1Username === username || value.p2Username === username)
				game = value;
		});
		if (!game) return;
		game.afkGame(username);
	}
}
