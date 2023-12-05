import { Body, Engine, Runner, Bodies, World, Events } from 'matter-js';

const BALL_SPEED = 7;
const PADDLE_SPEED = 7;
const PADDLE_H = 120;
const PADDLE_W = 20;
const WIDTH = 800;
const HEIGHT = 400;

export class Game {
	private readonly id: string;
	readonly p1Username: string;
	readonly p2Username: string;
	client1: any;
	client2: any;
	endCallback: any;
	
	private map;
	private matter;
	private m_runner;
	private ball;
	private player1;
	private player2;
	private score;
	private pDirection;
	private ballDirection = {
		x: 0,
		y: 0,
	};
	p1Id: number;
	p2Id: number;

	// private readonly progressService = new progressService(); // FOR ACHIEVMENTS

	constructor(clientsData: any) {
		this.id = clientsData.id;
		this.p1Username = clientsData.p1Username;
		this.p2Username = clientsData.p2Username;
		this.client1 = clientsData.client1;
		this.client2 = clientsData.client2;
		this.p1Id = clientsData.p1Id;
		this.p2Id = clientsData.p2Id;
		this.emitGame(true, true);
	}

	startGame() {
		this.createMap();
		this.createBorders();
		this.createPlayers();
		this.createBall();
		this.eventsHandler();
		this.countdown();
		this.score = {
			player1: 0,
			player2: 0,
		};
		this.pDirection = {
			player1: {
				up: false,
				down: false,
			},
			player2: {
				up: false,
				down: false,
			}
		};
		setTimeout(() => {
			this.ballDirection = {
				x: Math.cos(1) * BALL_SPEED,
				y: Math.sin(0.75) * BALL_SPEED,
			}
		}, 5000);
	}

	updateGame() {
		const state: GameStateDto = {
			ball: {
				x: this.ball.pos.x,
				y: this.ball.pos.y,
			},
			player1: {
				x: this.player1.pos.x,
				y: this.player1.pos.y,
			},
			player2: {
				x: this.player2.pos.x,
				y: this.player2.pos.y,
			},
			score: this.score,
		};
		this.client1 && this.client1.emit('GAME_STATE', state);
	}

	updateBall = () => {
		if (this.ballDirection.y === 0 && this.ballDirection.x !== 0)
			this.ballDirection.y = 1;
		else if (this.ballDirection.x === 0 && this.ballDirection.y !== 0)
			this.ballDirection.x = 1;

		Body.setVelocity(this.ball, this.ballDirection);
		this.updatePlayers();
		this.updateGame();
	}

	stopGame(save: boolean = true) {
		Events.off(this.matter, "startCollision", this.onStartCollision);
		Events.off(this.matter, "endCollision", this.onEndCollision);
		Events.off(this.matter, "preUpdate", this.updateBall);

		World.clear(this.map);
		Engine.clear(this.matter);
		Runner.stop(this.m_runner);
		this.matter = null;
		this.map = null;
		this.m_runner = null;

		// FOR ACHIEVMENTS //
		// if (save)
		// {
		// 	this.progressService.save({
		// 		winner: this.score.player1 > this.score.player2 ? this.p1Username : this.p2Username,
		// 		loser: this.score.player1 < this.score.player2 ? this.p1Username : this.p2Username,
		// 		score: {
		// 			winner: this.score.player1 > this.score.player2 ? this.score.player1 : this.score.player2,
		// 			loser: this.score.player1 < this.score.player2 ? this.score.player1 : this.score.player2,
		// 		},
		// 		mode: '1v1',
		// 		winnerClient: this.score.player1 > this.score.player2 ? this.client1 : this.client2,
		// 		loserClient: this.score.player1 < this.score.player2 ? this.client1 : this.client2,
		// 	});
		// }
		this.client1 = null;
		this.client2 = null;
	}

	move(client: any, move)
	{
		if (client.id === this.client1.id)
		{
			this.pDirection.player1.up = move.up;
			this.pDirection.player1.down = move.down;
		}
		else if (client.id === this.client2.id)
		{
			this.pDirection.player2.up = move.up;
			this.pDirection.player2.down = move.down;
		}
	}

	updatePlayers() {
		if (!this.client1 || !this.client2)
			this.stopGame(false);

			if (this.pDirection.player1.up && this.player1.pos.y - PADDLE_H / 2 > 0)
			{
				Body.setPosition(this.player1, {
					x: this.player1.pos.x,
					y: this.player1.pos.y - PADDLE_SPEED,
				});
			}
			else if (this.pDirection.player1.down && this.player1.pos.y + PADDLE_H / 2 < HEIGHT)
			{
				Body.setPosition(this.player1, {
					x: this.player1.pos.x,
					y: this.player1.pos.y + PADDLE_SPEED,
				});
			}
			if (this.pDirection.player2.up && this.player2.pos.y - PADDLE_H / 2 > 0)
			{
				Body.setPosition(this.player2, {
					x: this.player2.pos.x,
					y: this.player2.pos.y - PADDLE_SPEED,
				});
			}
			else if (this.pDirection.player2.down && this.player2.pos.y + PADDLE_H / 2 < HEIGHT)
			{
				Body.setPosition(this.player2, {
					x: this.player2.pos.x,
					y: this.player2.pos.y + PADDLE_SPEED,
				});
			}
	}

	createMap() {
		this.matter = Engine.create({
			gravity: {
				x: 0,
				y: 0,
				sclae: 0,
			},
		});
		this.map = this.matter.map;
		this.m_runner = Runner.create({
			delta: 1000 / 60,
			isFixed: true,
		});
		Runner.run(this.m_runner, this.matter);
	}

	createBorders() {
		const map = this.map;
		const borders = [
			Bodies.rectangle(WIDTH / 2, 0, WIDTH, 1 ,{
				isStatic: true,
				id: 1,
			}),
			Bodies.rectangle(WIDTH / 2, HEIGHT, WIDTH, 1, {
				isStatic: true,
				id: 2,
			}),
			Bodies.rectangle(0, HEIGHT / 2, 1, HEIGHT, {
				isStatic: true,
				id: 3,
			}),
			Bodies.rectangle(WIDTH, HEIGHT / 2, 1, HEIGHT, {
				isStatic: true,
				id: 4,
			}),
		];
		World.add(map, borders);
	}

	createPlayers() {
		this.player1 = Bodies.rectangle(PADDLE_W / 2, HEIGHT / 2, PADDLE_W, PADDLE_H, {
			id: 6,
			mass: 100,
			isStatic: true,
		});
		this.player2 = Bodies.rectangle(WIDTH - PADDLE_W / 2, HEIGHT / 2, PADDLE_W, PADDLE_H, {
			id: 7,
			mass: 100,
			isStatic: true,
		});
		World.add(this.map, [this.player1, this.player2]);
	}

	createBall() {
		const map = this.map;
		this.ball = Bodies.circle(450, 250, 20, {
			id: 5,
			mass: 0,
		});
		World.add(map, [this.ball]);
	}

	eventsHandler() {
		Events.on(this.matter, "startCollision", this.onStartCollision);
		Events.on(this.matter, "endCollision", this.onEndCollision);
		Events.on(this.matter, "preUpdate", this.updateBall);
	}

	emitGame(isClient1: boolean, isClient2: boolean) {
		if (isClient1 && this.client1)
			this.client1.emit((isClient2) ? 'match' : 're-match', {
				lobbyName: this.id,
				player: 1,
				opponentId: this.p2Id,
				opponentName: this.p2Username,
			});
		if (isClient2 && this.client2)
			this.client2.emit((isClient1) ? 'match' : 're-match', {
				lobbyName: this.id,
				player: 2,
				opponentId: this.p1Id,
				opponentName: this.p1Username,	
			});
	}

	countdown() {
		setTimeout(() => {
			this.client1 && this.client1.emit('GAME-MESSAGE', '5');
			this.client2 && this.client2.emit('GAME-MESSAGE', '5');
		}, 1000);
		setTimeout(() => {
			this.client1 && this.client1.emit('GAME-MESSAGE', '4');
			this.client2 && this.client2.emit('GAME-MESSAGE', '4');
		}, 2000);
		setTimeout(() => {
			this.client1 && this.client1.emit('GAME-MESSAGE', '3');
			this.client2 && this.client2.emit('GAME-MESSAGE', '3');
		}, 3000);
		setTimeout(() => {
			this.client1 && this.client1.emit('GAME-MESSAGE', '2');
			this.client2 && this.client2.emit('GAME-MESSAGE', '2');
		}, 4000);
		setTimeout(() => {
			this.client1 && this.client1.emit('GAME-MESSAGE', '1');
			this.client2 && this.client2.emit('GAME-MESSAGE', '1');
		}, 5000);
		setTimeout(() => {
			this.client1 && this.client1.emit('GAME-MESSAGE', 'START!');
			this.client2 && this.client2.emit('GAME-MESSAGE', 'START!');
		}, 6000);
		setTimeout(() => {
			this.client1 && this.client1.emit('GAME-MESSAGE', '');
			this.client2 && this.client2.emit('GAME-MESSAGE', '');
		}, 7500);
	}

	onStartCollision = (event) => {
		let	collide = 10;
		let pairs = event.pairs;

		pairs.forEach((pair: any) => {
			if (pair.bodyA.id == 1 || pair.bodyA.id == 2)
				this.ballDirection.y = -this.ballDirection.y;
			else if (pair.bodyA.id == 3 || pair.bodyA.id == 4)
				this.ballDirection.x = -this.ballDirection.x;

			if (pair.bodyA.id == 5 && pair.bodyB.id == 6)
			{
				collide = (pair.bodyA.pos.y - pair.bodyB.pos.y) / (PADDLE_H / 2);
				let angle = (Math.PI / 3) * collide;
				this.ballDirection.x = Math.cos(angle) * BALL_SPEED;
				this.ballDirection.y = Math.sin(angle) * BALL_SPEED;
			}
			if (pair.bodyA.id == 5 && pair.bodyB.id == 7)
			{
				collide = (pair.bodyA.pos.y - pair.bodyB.pos.y) / (PADDLE_H / 2);
				let angle = (Math.PI / 3) * collide;
				this.ballDirection.x = -Math.cos(angle) * BALL_SPEED;
				this.ballDirection.y = Math.sin(angle) * BALL_SPEED;
			}
		});
	}

	onEndCollision = (event) => {
		const resetBall = () => {
			Body.setPosition(this.ball, {
				x: 400,
				y: 200,
			});
			this.ballDirection = {
				x: 0,
				y: 0,
			};
			const diffScore = (this.score.player1 + this.score.player2) % 2;
			const ballDirections = [
				{
					x: Math.cos(1) * BALL_SPEED,
					y: Math.sin(0.75) * BALL_SPEED,
				},
			]
			this.countdown();
			setTimeout(() => { this.ballDirection = ballDirections[diffScore] }, 5000);
		};

		let pairs = event.pairs;
		pairs.forEach((pair: any) => {
			if (pair.bodyA.id == 3 && pair.bodyB.id == 5)
			{
				this.score.player2++;
				this.score.player2 < 5 && resetBall();
			}
			else if (pair.bodyA.id == 4 && pair.bodyB.id == 5)
			{
				this.score.player1++;
				this.score.player1 < 5 && resetBall();
			}
		});
		const playa1 = this.score.player1;
		const playa2 = this.score.playa2;

		if (playa1 >= 5 || playa2 >= 5)
		{
			this.client1 && this.client1.emit('GAME-MESSAGE', `${playa1 > playa2 ? 'won' : 'lost'}`);
			this.client2 && this.client2.emit('GAME-MESSAGE', `${playa2 > playa1 ? 'won' : 'lost'}`);
			this.client1 && this.client1.emit('END-GAME', { winner: playa1 < playa2 ? 1 : 2 });
			this.client2 && this.client2.emit('END-GAME', { winner: playa2 < playa1 ? 1 : 2 });
			this.endCallback(this.id);
			this.stopGame();
		}
	}
	
}