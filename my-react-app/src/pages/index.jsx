// pages/index.jsx



import React from 'react';
import Link from 'next/link';
import Navigation from '../components/Navigation';

const Home = () => {
  return (
    <div style={styles.container}>
    <Navigation />
    <h1 style={styles.heading}>Welcome to Transcendence 42</h1>
      <p style={styles.paragraph}>
        This is the main page of your Next.js app. Customize the content and
        styling based on your project requirements.
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

export default Home;



