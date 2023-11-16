import React, { useEffect, useState } from 'react';

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
}

interface Canvas {
	width: number;
	height: number;
}

interface Score {
	player1 : number;
	player2 : number;
}

const PongGame = () => {
  const [canvas, setCanvas] = useState<Canvas>({
	width: 1280,
	height: 720,
  });

  const [ball, setBall] = useState<Ball>({
	x: canvas.width / 2,
	y: canvas.height / 2,
	speedX: 10,
	speedY: 10,
  });
  const [paddle1, setPaddle2] = useState<Paddle>({
	  width: (canvas.width / 100) * 1.5,
	  height: (canvas.height / 100) * 25,
	  x: canvas.width - (canvas.width / 100) * 1.5 - 10,
	  y: (canvas.height / 2) - ((canvas.height / 100) * 25 / 2),
  });
  const [paddle2, setPaddle1] = useState<Paddle>({
	  width: (canvas.width / 100) * 1.5,
	  height: (canvas.height / 100) * 25,
	  x: (canvas.width / 100) / 1.5,
	  y: (canvas.height / 2) - ((canvas.height / 100) * 25 / 2),
  });
  const [Score, setScore] = useState<Score>({
	  player1: 0,
	  player2: 0,
  });

  useEffect(() =>
  {
	const canvas = document.getElementById('canvas') as HTMLCanvasElement;
	const context = canvas.getContext('2d') as CanvasRenderingContext2D;
	const width = canvas.width;
	const height = canvas.height;

	const draw = () =>
	{
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

	//   Draw Ball
      context.beginPath();
	  context.arc(ball.x, ball.y, 15, 0, Math.PI * 2);
      context.fillStyle = '#FFFFFF';
      context.fill();
      context.closePath();

	// Draw score
	  context.font = '50px Arial';
	  context.fillText(`${Score.player1}`, width / 2 + (width / 4), 50);
	  context.fillText(`${Score.player2}`, width / 2 - (width / 4), 50);
	}


	const update = () =>
	{
		ball.x += ball.speedX;
		ball.y += ball.speedY;

		// Check if ball hits top or bottom
		if (ball.y + ball.speedY > height || ball.y + ball.speedY < 0) {
			
			ball.speedY *= -1;
		}
		// Check if ball hits paddle
		if (ball.x + ball.speedX > paddle1.x && ball.x + ball.speedX < paddle1.x + paddle1.width && ball.y + ball.speedY > paddle1.y && ball.y + ball.speedY < paddle1.y + paddle1.height
			|| ball.x + ball.speedX > paddle2.x && ball.x + ball.speedX < paddle2.x + paddle2.width && ball.y + ball.speedY > paddle2.y && ball.y + ball.speedY < paddle2.y + paddle2.height) {
			ball.speedX *= -1;
		}

		// Check if ball hits
		else if (ball.x + ball.speedX > width) // ball hit right wall
		{
			ball.x = width / 2;
			ball.y = height / 2;
			setScore({player1: Score.player1 + 1, player2: Score.player2});
		}

		else if (ball.x + ball.speedX < 0) // ball hit left wall
		{
			ball.x = width / 2;
			ball.y = height / 2;
			setScore({player1: Score.player1, player2: Score.player2 + 1});
		}
		
	};

	const loop = () => {
	  draw();
	  update();
	  window.requestAnimationFrame(loop);
	};

	window.requestAnimationFrame(loop);
  }, []);

  const keys: any = {};

  return (
	<div className="App">
	  <canvas id="canvas" width={canvas.width} height={canvas.height}></canvas>
	</div>
  );
};

export default PongGame;