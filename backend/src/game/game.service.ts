import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { InvGameDto } from './dto/inv-game.dto';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { genID } from './utils/genID';
import { Game } from './game';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GameService {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  private games = new Map<string, Game>();
  private queue: { client: Socket; username: string; gameType: number }[] = [];
  private players = new Map<string, Socket>();
  private invits: InvGameDto[] = [];

  async createGame(client: Socket, data: { gameType: number }) {
    const { gameType } = data;
    const username = this.getUsernameBySocket(client);

    if (!username) return;

    // Check if the player is already in the queue for the same game type
    if (
      this.queue.find((p) => p.username === username && p.gameType === gameType)
    ) {
      client.emit('error', 'Already in Queue Dummy');
      client.emit('cancelGame', []);
      return;
    }

    // Check if the player is already in a game
    if (this.isInGame(username)) {
      client.emit('error', 'Already in-game Dummy');
      client.emit('cancelGame', []);
      return;
    }

    this.queue.push({ username, client, gameType });

    if (this.queue.length >= 2) {
      // Find a player with the same gameType
      const p1 = this.queue.find((p) => p.gameType === gameType);
      const p2 = this.queue.find(
        (p) => p.username !== p1?.username && p.gameType === gameType,
      );

      if (!p1 || !p2) return;
      this.queue = this.queue.filter(
        (p) => p.username !== p1.username && p.username !== p2.username,
      );
      const id = genID(this.games);

      const game = new Game(
        {
          id,
          client1: p1.client,
          client2: p2.client,
          p1Username: p1.username,
          p2Username: p2.username,
          p1Id: (await this.getUser(p1.client)).uid,
          p2Id: (await this.getUser(p2.client)).uid,
        },
        gameType,
      );

      const p1Id = (await this.getUser(p1.client)).uid;
      const p2Id = (await this.getUser(p2.client)).uid;
      this.setUserStatus(p1Id, p2Id, 'In-Game');

      game.endGameCallback = this.stopGame;
      this.games.set(id, game);
      game.startGame();
    }
  }

  cancelGame(client: Socket): void {
    const username = this.getUsernameBySocket(client);
    this.queue = this.queue.filter((p) => p.username !== username);
  }

  moveGame(client: Socket, data: any): void {
    try {
      const game: Game = this.games.get(data.room);
      if (!game) return;
      game.move(client, data.move);
    } catch (error) {}
  }

  async setUserStatus(p1: number, p2: number, status: string) {
    try {
      await this.prisma.user.update({
        where: { id: p1 },
        data: { userStatus: status },
      });
      await this.prisma.user.update({
        where: { id: p2 },
        data: { userStatus: status },
      });
    } catch {}
  }

  async invGame(
    fromClient: Socket,
    data: { username: string; gameType: number },
  ) {
    if (!data.username) return;

    const fromUsername = this.getUsernameBySocket(fromClient);
    if (!fromUsername) return;

	// check if username is a a valid user
	const user = await this.prisma.user.findUnique({
		where: { username: data.username },
	});
	if (!user) {
		fromClient.emit('error', `${data.username} is not a valid user`);
		fromClient.emit('invite-canceled', {});
		return;
	}

    if (this.isInGame(data.username)) {
      fromClient.emit('error', `${data.username} is Already in a game`);
      fromClient.emit('invite-canceled', {});
      return;
    }

    if (this.isInGame(fromUsername)) {
      fromClient.emit('error', 'You Already in a game');
      fromClient.emit('invite-canceled', {});
      return;
    }

    const toClient = this.players.get(data.username);
    if (!toClient) {
      fromClient.emit('error', `${data.username} is not connected`);
      fromClient.emit('invite-canceled', {});
      return;
    }

    this.invits.push({
      from: fromUsername,
      to: data.username,
      time: new Date(),
      type: data.gameType,
    });

    setTimeout(() => {
    	this.invits = this.invits.filter((i) => i.from !== fromUsername && i.to !== data.username);
    }, 20 * 1000);

    const userId = (await this.getUser(fromClient)).uid;
    const avatar = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { avatar: true },
    });
    toClient.emit('invGame', {
      username: fromUsername,
      id: userId,
      gameType: data.gameType,
      avatar: avatar.avatar,
    });
  }

  async acceptGame(toClient: Socket, data: { username: string }) {
    if (!data.username) return;

    const fromClient = this.players.get(data.username);
    if (!fromClient) {
      toClient.emit('error', `${data.username} is no longer Online`);
      return;
    }

    const toUsername = this.getUsernameBySocket(toClient);

    const invite = this.invits.find(
      (i) => i.from === data.username && i.to === toUsername,
    );

    if (!invite) {
      toClient.emit('error', `No invites from ${data.username}`);
      return;
    }

    this.invits.splice(this.invits.indexOf(invite), 1);

    fromClient.emit('invite-accepted', {});
    toClient.emit('invite-accepted', {});

    const id = genID(this.games);
    const game = new Game(
      {
        id,
        client1: fromClient,
        client2: toClient,
        p1Username: data.username,
        p2Username: toUsername,
        p1Id: (await this.getUser(fromClient)).uid,
        p2Id: (await this.getUser(toClient)).uid,
      },
      invite.type,
    );

    const p1 = (await this.getUser(fromClient)).uid;
    const p2 = (await this.getUser(toClient)).uid;

    game.endGameCallback = this.stopGame;
    this.games.set(id, game);

    try {
      game.startGame();
      this.setUserStatus(p1, p2, 'In-Game');
    } catch (error) {
      console.error('Failed to start game:', error);
      this.games.delete(id);
    }
  }

  cancelInvGame(client: Socket, data: { username: string }): void {
    if (!data.username) return;
    const fromUsername = this.getUsernameBySocket(client);
    if (!fromUsername) return;

    this.invits = this.invits.filter(
      (i) => i.from !== fromUsername && i.to !== data.username,
    );
    const toClient = this.players.get(data.username);
    const fromClient = this.players.get(fromUsername);
    if (toClient) toClient.emit('invite-canceled', {});
    if (fromClient) fromClient.emit('invite-canceled', {});
  }

  rejectInvGame(toClient: Socket, data: { username: string }): void {
    if (!data.username) return;
    const fromUsername = this.getUsernameBySocket(toClient);
    if (!fromUsername) return;

    this.invits = this.invits.filter(
      (i) => i.from !== fromUsername && i.to !== data.username,
    );
    const fromClient = this.players.get(data.username);
    if (toClient) toClient.emit('invite-canceled', {});
    if (fromClient) fromClient.emit('invite-canceled', {});
  }

  initGame(client: Socket, username: string): void {
    this.players.set(username, client);
  }

  leftGame(client: Socket): void {
    const username = this.getUsernameBySocket(client);
    if (!username) {
      client.emit('error', 'Something wrong');
    }
  }

  disconnectGame(client: Socket): void {
    if (!client) return;
    const username = this.getUsernameBySocket(client);
    if (username) return;

    this.players.delete(username);

    this.queue = this.queue.filter((p) => p.username !== username);

    this.players[username] = null;
    this.games.forEach((game) => {
      if (game.p1Username === username) game.client1 = null;
      if (game.p2Username === username) game.client2 = null;
    });

    this.invits = this.invits.filter(
      (i) => i.from !== username && i.to !== username,
    );
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
      const unedrCoded = jwt.verify(token, this.config.get('JWT_SECRET')) as {
        uid: number;
        username: string;
        iat: number;
        exp: number;
      };
      return unedrCoded;
    } catch {}

    try {
      const token = client.handshake.headers.jwt as string;
      if (!token) return null;
      const unedrCoded = jwt.verify(token, this.config.get('JWT_SECRET')) as {
        uid: number;
        username: string;
        iat: number;
        exp: number;
      };
      return unedrCoded;
    } catch {
      return null;
    }
  }

  public stopGame = (id: string) => {
    const game = this.games.get(id);
    if (!game) {
      console.warn(`Game '${id}' cannot be stopped`);
      return;
    }
	this.setUserStatus(game.p1Id, game.p2Id, 'Online');
    this.games.delete(id);
  };

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
    this.games.forEach((value: Game) => {
      if (value.p1Username === username || value.p2Username === username)
        game = value;
    });
    if (!game) return;
    game.afkGame(username);
  }
}
