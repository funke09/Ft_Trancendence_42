import React from 'react';
import Link from 'next/link';
import Navigation from '../components/Navigation';

const Chat = () => {
  return (
    <div style={styles.container}>
    <Navigation />
    <h1 style={styles.heading}>Chat Space !</h1>
      <p style={styles.paragraph}>
        Chat Space !
      </p>
    </div>
  );
};

const styles = {
  container: {
    background: 'linear-gradient(to bottom, #00C11F, #92F11D)',
    color: '#111555',
    padding: '20px',
    minHeight: '100vh',
  },
  heading: {
    color: '#111111', // Deep pink color for the heading
  },
  paragraph: {
    marginBottom: '20px',
  },
};

export default Chat;