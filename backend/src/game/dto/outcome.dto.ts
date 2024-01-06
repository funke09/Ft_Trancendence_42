export class OutcomeDto {
  winner: string;
  loser: string;
  score: {
    winner: number;
    loser: number;
  };
  mode: string;
  wClient: any;
  lClient: any;
}
