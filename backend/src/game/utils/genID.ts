import * as rs from 'randomstring';
import { Game } from '../game';

export function genID(games: Map<string, Game>, len = 10): string {
  const res = rs.generate(len);
  if (games.has(res)) {
    return genID(games);
  }
  return res;
}
