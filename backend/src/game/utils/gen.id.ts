import * as random from 'randomstring';
import { Game } from '../game';

export function genId(game: Map<string, Game>, length = 8): string {
	let res = random.generate(length);
	if (game.has(res))
		return genId(game);
	return res;
}