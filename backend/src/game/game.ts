import { GameStateDto } from "./dto/game-state.dto";
import { GameData } from "./game.data";
import { Body, Bodies, World, Events, Engine, Runner } from 'matter-js';

const Height = 600;
const Width = 1200;
const PaddleWidth = 15;
const PaddleHieght = 110;
const PaddleSpeed = 12; 

export class Game {
	private readonly id: string;
	readonly p1Username: string;
	readonly p2Username: string;
	client1: any;
	client2: any;
	endGameCallback: any;
	gameType: number;
	BallSpeed = 12;

	private world;
	private engine;
	private runner;
	private ball;
	private player1;
	private player2;
	private score;
	private playerDir;
	private ballDir = {
		x: 0,
		y: 0,
	};
	p1Id: number;
	p2Id: number;

	private readonly gameData = new GameData();

	constructor(ClientData: any, gameType: number) {
		this.id = ClientData.id;
		this.p1Username = ClientData.p1Username;
		this.p2Username = ClientData.p2Username;
		this.client1 = ClientData.client1;
		this.client2 = ClientData.client2;
		this.p1Id = ClientData.p1Id;
		this.p2Id = ClientData.p2Id;
		this.gameType = gameType;
		this.BallSpeed = this.getBallSpeed(gameType); // Set BallSpeed based on gameType
		this.emitGame(true, true);
	}

	getBallSpeed(gameType: number): number {
		switch (gameType) {
		  case 1:
			return 12;
		  case 2:
			return 18;
		  case 3:
			return 22;
		  default:
			return 12;
		}
	  }

	startGame() {
		this.createWorld();
		this.createBorders();
		this.createPaddles();
		this.createBall();
		this.handleEvents();
		this.score = {
			player1: 0,
			player2: 0,
		};
		this.playerDir = {
			player1: {
				up: false,
				down: false,
			},
			player2: {
				up: false,
				down: false,
			}
		};
		this.countDown();
		setTimeout(() => {
			this.ballDir = {
				x: Math.cos(1) * this.BallSpeed,
				y: Math.sin(0.75) * this.BallSpeed,
			}
		}, 5000);
	}

	updateGame() {
		const gameState: GameStateDto = {
			ball: {
				x: this.ball.position.x,
				y: this.ball.position.y,
			},
			player1: {
				x: this.player1.position.x,
				y: this.player1.position.y,
			},
			player2: {
				x: this.player2.position.x,
				y: this.player2.position.y,
			},
			score: this.score,
			gameType: this.gameType,
		};
		this.client1 && this.client1.emit('gameState', gameState);
		this.client2 && this.client2.emit('gameState', gameState);
	}

	updatePaddles() {
		if (!this.client1 || !this.client2)
			this.stopGame(false);

		if (this.playerDir.player1.up && this.player1.position.y - PaddleHieght / 2 > 0) {
			Body.setPosition(this.player1, {
				x: this.player1.position.x,
				y: this.player1.position.y - PaddleSpeed,
			});
		} else if (this.playerDir.player1.down && this.player1.position.y + PaddleHieght / 2 < Height) {
			Body.setPosition(this.player1, {
				x: this.player1.position.x,
				y: this.player1.position.y + PaddleSpeed,
			});
		}
		if (this.playerDir.player2.up && this.player2.position.y - PaddleHieght / 2 > 0) {
			Body.setPosition(this.player2, {
				x: this.player2.position.x,
				y: this.player2.position.y - PaddleSpeed,
			});
		} else if (this.playerDir.player2.down && this.player2.position.y + PaddleHieght / 2 < Height) {
			Body.setPosition(this.player2, {
				x: this.player2.position.x,
				y: this.player2.position.y + PaddleSpeed,
			});
		}
	}

	createBall() {
		const world = this.world;
		this.ball = Bodies.circle(600, 300, 15, {
			id: 5,
			mass: 0,
		});

		World.add(world, [this.ball]);
	}

	updateBall = () => {
		if (this.ballDir.y === 0 && this.ballDir.x !== 0)
			this.ballDir.y = 1;
		else if (this.ballDir.x === 0 && this.ballDir.y !== 0)
			this.ballDir.x = 1;

		Body.setVelocity(this.ball, this.ballDir);
		this.updatePaddles();
		this.updateGame();
	}

	onCollisionStart = (event) => {
		let collide = 10; 
		let pairs = event.pairs;
		
		pairs.forEach((pair: any) => {
		  if (pair.bodyA.id == 1 || pair.bodyA.id == 2) {
			this.ballDir.y = -this.ballDir.y;
		  } else if (pair.bodyA.id == 3 || pair.bodyA.id == 4) {
			this.ballDir.x = -this.ballDir.x;
		  }	
		  if (pair.bodyA.id == 5 && pair.bodyB.id == 6) {
			collide = (pair.bodyA.position.y - pair.bodyB.position.y) / (PaddleHieght / 2);
			let angle = (Math.PI / 3) * collide;
			this.ballDir.x = Math.cos(angle) * this.BallSpeed;
			this.ballDir.y = Math.sin(angle) * this.BallSpeed;
		  }
		  if (pair.bodyA.id == 5 && pair.bodyB.id == 7) {
			collide = (pair.bodyA.position.y - pair.bodyB.position.y) / (PaddleHieght / 2);
			let angle = (Math.PI / 3) * collide;
			this.ballDir.x = -Math.cos(angle) * this.BallSpeed;
			this.ballDir.y = Math.sin(angle) * this.BallSpeed;
		  }
		});
	  }
	  

	onCollisionEnd = (event) => {
		const resetBall = () => {
			Body.setPosition(this.ball, {
				x: 600,
				y: 300,
			});

			this.ballDir = {
				x: 0,
				y: 0,
			};

			const diffScore = (this.score.player1 + this.score.player2) % 2;

			const ballDir = [
				{
					x: Math.cos(1) * this.BallSpeed,
					y: Math.sin(0.75) * this.BallSpeed,
				},
				{
					x: -Math.cos(1) * this.BallSpeed,
					y: -Math.sin(0.75) * this.BallSpeed,
				},
			]
			this.countDown();
			setTimeout(() => { this.ballDir = ballDir[diffScore]}, 5000);
		};

		let pairs = event.pairs;
		pairs.forEach((pair: any) => {
			if (pair.bodyA.id == 3 && pair.bodyB.id == 5) {
				this.score.player2++;
				this.score.player2 <= 5 && resetBall();
			} else if (pair.bodyA.id == 4 && pair.bodyB.id == 5) {
				this.score.player1++;
				this.score.player1 <= 5 && resetBall();
			}
		});

		const p1 = this.score.player1;
		const p2 = this.score.player2;

		if (p1 >= 5 || p2 >= 5) {
			this.client1 && this.client1.emit('gameMsg', `${p1 > p2 ? 'WINNER' : 'GAME OVER'}`);
			this.client2 && this.client2.emit('gameMsg', `${p2 > p1 ? 'WINNER' : 'GAME OVER'}`);
			this.client1 && this.client1.emit('endGame', { winner: p1 < p2 ? 1 : 2});
			this.client2 && this.client2.emit('endGame', { winner: p2 < p1 ? 1 : 2});
			this.endGameCallback(this.id);
			this.stopGame();
		}
	}

	handleEvents() {
		Events.on(this.engine, "collisionStart", this.onCollisionStart);

		Events.on(this.engine, "collisionEnd", this.onCollisionEnd);

		Events.on(this.engine, "beforeUpdate", this.updateBall);
	  }

	createBorders() {
		const world = this.world;
		const borders = [
			Bodies.rectangle(Width / 2, 0, Width, 1, {
				isStatic: true,
				id: 1,
			}),
			Bodies.rectangle(Width / 2, Height, Width, 1, {
				isStatic: true,
				id: 2,
			}),
			Bodies.rectangle(0, Height / 2, 1, Height, {
				isStatic: true,
				id: 3,
			}),
			Bodies.rectangle(Width, Height / 2, 1, Height, {
				isStatic: true,
				id: 4,
			}),
		];

		World.add(world, borders);
	}

	createPaddles() {
		this.player1 = Bodies.rectangle(PaddleWidth / 2, Height / 2, PaddleWidth, PaddleHieght, {
		  id: 6,
		  mass: 100,
		  isStatic: true,
		});
	  this.player2 = Bodies.rectangle(Width - PaddleWidth / 2, Height / 2, PaddleWidth, PaddleHieght, {
		  id: 7,
		  mass: 100,
		  isStatic: true,
		});
		World.add(this.world, [this.player1, this.player2]);
	}

	createWorld() {
		this.engine = Engine.create({
			gravity: {
				x: 0,
				y: 0,
				scale: 0,
			},
		});
		this.world = this.engine.world;
		this.runner = Runner.create({
			isFixed: true,
			delta: 1000 / 60,
		});
		Runner.run(this.runner, this.engine);
	}

	move(client: any, move) {
		if (client.id === this.client1.id) {
			this.playerDir.player1.up = move.up;
			this.playerDir.player1.down = move.down;
		} else if (client.id === this.client2.id) {
			this.playerDir.player2.up = move.up;
			this.playerDir.player2.down = move.down;
		}
	}

	emitGame(isClient1: boolean, isClient2: boolean) {
		if (isClient1 && this.client1)
			this.client1.emit((isClient2) ? 'match' : 're-match', {
				roomName: this.id,
				player: 1,
				oppName: this.p2Username,
				oppId: this.p2Id,	
			});
		if (isClient2 && this.client2)
			this.client2.emit((isClient1) ? 'match' : 're-match', {
				roomName: this.id,
				player: 2,
				oppName: this.p1Username,
				oppId: this.p1Id,	
			});
	}

	countDown() {
		setTimeout(() => {
			this.client1 && this.client1.emit('gameMsg', '3');
			this.client2 && this.client2.emit('gameMsg', '3');
		  }, 1000);
	  
		  setTimeout(() => {
			this.client1 && this.client1.emit('gameMsg', '2');
			this.client2 && this.client2.emit('gameMsg', '2');
		  }, 2000);
	  
		  setTimeout(() => {
			this.client1 && this.client1.emit('gameMsg', '1');
			this.client2 && this.client2.emit('gameMsg', '1');
		  }, 3000);
	  
		  setTimeout(() => {
			this.client1 && this.client1.emit('gameMsg', 'START GAME');
			this.client2 && this.client2.emit('gameMsg', 'START GAME');
		  }, 4000);
	  
		  setTimeout(() => {
			this.client1 && this.client1.emit('gameMsg', '');
			this.client2 && this.client2.emit('gameMsg', '');
		  }, 5500);
	}

	reconnectPlayer(username: string, client: any): void {
		if (username === this.p1Username)
			this.client1 = client;
		else if (username === this.p2Username)
			this.client2 = client;

		this.emitGame(username === this.p1Username, username === this.p2Username);
	}

	afkGame(username: string) {
		if (username === this.p1Username) {
			this.client2 && this.client2.emit('gameMsg', 'Opponent Left');
			this.client2 && this.client2.emit('endGame', { winner: 2 });
			this.score.player2 = 5;
			this.score.player1 = 0;
		} else if (username === this.p2Username) {
			this.client1 && this.client1.emit('gameMsg', 'Opponent Left');
			this.client1 && this.client1.emit('endGame', { winner: 1 });
			this.score.player1 = 5;
			this.score.player2 = 0;
		}
		this.endGameCallback(this.id);
		this.stopGame();
	}

	stopGame(backup: boolean = true) {
		Events.off(this.engine, "collisionStart", this.onCollisionStart);
		Events.off(this.engine, "collisionEnd", this.onCollisionEnd);
		Events.off(this.engine, "preUpdate", this.updateBall);
	
		World.clear(this.world, null);
		Engine.clear(this.engine);
		Runner.stop(this.runner);
		this.engine = null;
		this.world = null;
		this.runner = null;

		// if (backup) {
		// 	this.gameData.saveGame({
		// 		winner: this.score.player1 > this.score.player2 ? this.p1Username : this.p2Username,
		// 		loser: this.score.player1 < this.score.player2 ? this.p1Username : this.p2Username,
		// 		score: {
		// 			winner: this.score.player1 > this.score.player2 ? this.score.player1 : this.score.player2,
		// 			loser: this.score.player1 < this.score.player2 ? this.score.player1 : this.score.player2,
		// 		},
		// 		mode: 'pvp',
		// 		winnerClient: this.score.player1 > this.score.player2 ? this.client1 : this.client2,
		// 		loserClient: this.score.player1 < this.score.player2 ? this.client1 : this.client2,
		// 	});
		// }
		this.client1 = null;
		this.client2 = null;
	}
}