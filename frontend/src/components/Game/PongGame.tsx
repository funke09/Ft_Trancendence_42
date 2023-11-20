import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

interface Ball {
  x: number;
  y: number;
  speedX: number;
  speedY: number;
}

interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}

interface Canvas {
  width: number;
  height: number;
}

interface Score {
  player1: number;
  player2: number;
}

interface Rounds {
	player1: number;
	player2: number;
}

const PongGame = () => {
  const [canvas, setCanvas] = useState<Canvas>({
    width: 1920,
    height: 1080,
  });

  const initialBallSpeed = 10;

  const [ball, setBall] = useState<Ball>({
    x: canvas.width / 2,
    y: canvas.height / 2,
    speedX: initialBallSpeed,
    speedY: initialBallSpeed,
  });
  const [paddle1, setPaddle1] = useState<Paddle>({
    width: (canvas.width / 100) * 1.5,
    height: (canvas.height / 100) * 25,
    x: canvas.width - (canvas.width / 100) * 1.5 - 10,
    y: (canvas.height / 2) - ((canvas.height / 100) * 25 / 2),
    speed: 20,
  });
  const [paddle2, setPaddle2] = useState<Paddle>({
    width: (canvas.width / 100) * 1.5,
    height: (canvas.height / 100) * 25,
    x: (canvas.width / 100) / 1.5,
    y: (canvas.height / 2) - ((canvas.height / 100) * 25 / 2),
    speed: 6,
  });
  const [score, setScore] = useState<Score>({
    player1: 0,
    player2: 0,
  });

  const [rounds, setRounds] = useState<Rounds>({
	player1: 0,
	player2: 0,
  });

  
  useEffect(() => {
	const socket = io('http://localhost:3069/game');
	socket.on('start', (data: any) => {
		console.log('Match started', data);
	});
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    const width = canvas.width;
    const height = canvas.height;

	socket.on('connect', () => {
		console.log('Connected to WebSocket');
	  });

	socket.on('disconnect', () => {
		console.log('Disconnected from WebSocket');
	});

	// socket.on('game-data', (data: any) => {
	// 	ball = data.ball;
	// 	paddle1 = data.paddle1;
	// 	paddle2 = data.paddle2;
	// 	score = data.score;
	// 	rounds = data.rounds;
	// });

	socket.emit('join', null);
  
    const draw = () => {
      // Draw background
      context.fillStyle = 'black';
      context.fillRect(0, 0, width, height);

      // Draw paddles
      context.fillStyle = 'white';
      context.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
      context.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);

      // Draw dashed center line
      context.beginPath();
      context.strokeStyle = 'white';
      context.lineWidth = 5;
      context.setLineDash([10, 10]);
      context.moveTo(width / 2, 0);
      context.lineTo(width / 2, height);
      context.stroke();
      context.closePath();

      // Draw Ball
      context.beginPath();
      context.arc(ball.x, ball.y, 15, 0, Math.PI * 2);
      context.fillStyle = '#FFFFFF';
      context.fill();
      context.closePath();

      // Draw score
      context.font = '50px Arial';
      context.fillText(`${score.player2}`, width / 2 + (width / 4), 50);
      context.fillText(`${score.player1}`, width / 2 - (width / 4), 50);

	  // Draw rounds
	  context.font = '30px Arial';
	  context.fillText(`Round: ${rounds.player2}`, width / 2 + (width / 4), 80);
	  context.fillText(`Round: ${rounds.player1}`, width / 2 - (width / 4), 80);
    };

	const update = () => {

		ball.x += ball.speedX;
		ball.y += ball.speedY;
	  
		// Check if ball hits top or bottom
		if (ball.y + ball.speedY > height || ball.y + ball.speedY < 0) {
		  ball.speedY *= -1;
		}
		// Check if ball hits paddle
		if (
		  (ball.x + ball.speedX > paddle1.x &&
			ball.x + ball.speedX < paddle1.x + paddle1.width &&
			ball.y + ball.speedY > paddle1.y &&
			ball.y + ball.speedY < paddle1.y + paddle1.height) ||
		  (ball.x + ball.speedX > paddle2.x &&
			ball.x + ball.speedX < paddle2.x + paddle2.width &&
			ball.y + ball.speedY > paddle2.y &&
			ball.y + ball.speedY < paddle2.y + paddle2.height)
		) {
		  ball.speedX *= -1;
		}
	  
		// Check if ball hits
		else if (ball.x + ball.speedX > width) {
		  // ball hit right wall
		  ball.x = width / 2;
		  ball.y = height / 2;
		  score.player1++;
		} else if (ball.x + ball.speedX < 0) {
		  // ball hit left wall
		  ball.x = width / 2;
		  ball.y = height / 2;
		  score.player2++;
		}

		// AI for computer paddle
		// if (paddle2.y + paddle2.height / 2 < ball.y) {
		//   paddle2.y += paddle2.speed;
		// } else {
		//   paddle2.y -= paddle2.speed;
		// }

		// Check if round over
		if (score.player1 === 5) {
			rounds.player1++;
			score.player1 = 0;
		} else if (score.player2 === 5) {
			rounds.player2++;
			score.player2 = 0;
		}

		// Check if game over
		if (rounds.player1 === 3) {
			alert('Player 1 wins!');
			rounds.player1 = 0;
			rounds.player2 = 0;
		} else if (rounds.player2 === 3) {
			alert('Player 2 wins!');
			rounds.player1 = 0;
			rounds.player2 = 0;
		}
	}
	  
    const loop = () => {
	  update();
	  draw();
	  window.requestAnimationFrame(loop);
    };

    window.requestAnimationFrame(loop);

    // Key event handlers
    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' && paddle1.y > 0) {
        paddle1.y -= paddle1.speed;
		paddle2.y -= paddle2.speed;
      } else if (e.key === 'ArrowDown' && paddle1.y < height - paddle1.height) {
        paddle1.y += paddle1.speed;
		paddle2.y += paddle2.speed;
      }
    };
			

    const keyUpHandler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        // Handle paddle1 key releases if needed
      }
    };

    document.addEventListener('keydown', keyDownHandler, false);
    document.addEventListener('keyup', keyUpHandler, false);

    return () => {
	  socket.disconnect();
      document.removeEventListener('keydown', keyDownHandler);
      document.removeEventListener('keyup', keyUpHandler);
    };
  }, [ball, paddle1, paddle2, score]);

  return (
    <div className="App">
      <canvas id="canvas" width={canvas.width} height={canvas.height}></canvas>
    </div>
  );
};

export default PongGame;
