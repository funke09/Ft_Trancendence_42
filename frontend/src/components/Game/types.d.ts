export type Game = {
    ball: {
        x: number;
        y: number;
    };
    player1: {
        x: number;
        y: number;
    };
    player2: {
        x: number;
        y: number;
    };
    score: {
        player1: number;
        player2: number;
    };
	gameType: number;
};

export type oppType = {
	roomName: string;
	player: number;
	oppName: string;
	oppId: number;
};