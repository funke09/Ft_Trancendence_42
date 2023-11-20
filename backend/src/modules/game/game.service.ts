import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class GameService {
  private games: Map<string, Game> = new Map();

  createGame(id: string) {
    const game: Game = {
      id,
      players: [],
      state: 'waiting',
    };
    this.games.set(id, game);
    return game;
  }

  joinGame(gameId: string, playerId: string) {
    const game = this.games.get(gameId);
    if (game && game.state === 'waiting') {
      game.players.push(playerId);
    }
  }

  updateGame(gameId: string, data: any) {
	
    const game = this.games.get(gameId);
    if (game) {
      // Update game state based on data received from the client
      // For example, update ball position, paddle positions, score, etc.
    }
  }

  getGameById(id: string) {
    return this.games.get(id);
  }
}

interface Game {
  id: string;
  players: string[];
  state: string;
  // Add other properties as needed
}
