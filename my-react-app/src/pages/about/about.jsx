// pages/about.jsx
import React from 'react';
import Link from 'next/link';
import Navigation from '../components/Navigation';

const About = () => {
  return (
    <div>
      <Navigation />
      <h1>About Online Ping Pong Game</h1>
      <p>
        Welcome to the Online Ping Pong Game! This is an exciting multiplayer
        experience where players can compete in real-time matches of ping pong.
      </p>
      <h2>Key Features:</h2>
      <ul>
        <li>Real-time multiplayer gameplay</li>
        <li>Interactive ping pong paddles controlled by players</li>
        <li>Scoring system and game state synchronization</li>
        <li>User authentication for personalized gaming experience</li>
      </ul>
      <h2>How It Works:</h2>
      <p>
        Players can sign up or log in to their accounts to access the
        multiplayer ping pong game. Once logged in, they can create or join
        game rooms, where they'll be matched with other players in real-time.
      </p>
      <p>
        The game features real-time communication to synchronize game states
        and provide a seamless and responsive experience. Each player controls
        their ping pong paddle, and the scoring system keeps track of points
        scored during the match.
      </p>
      <h2>Get Started:</h2>
      <p>
        Ready to play? Navigate to the{' '}
        <Link href="/play">Play</Link> page to join an existing game room or
        create a new one. Invite your friends for an intense online ping pong
        match!
      </p>
      <p>
        If you're new here, check out the{' '}
        <Link href="/signup">Sign Up</Link> page to create your account and
        start playing.
      </p>
      <Link href="/">Go Back</Link>
    </div>
  );
};

export default About;
