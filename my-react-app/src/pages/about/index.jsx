// pages/index.jsx
import React from 'react';
import Navigation from '../components/Navigation';

const Home = () => {
  return (
    <div>
      <Navigation />
      <h1>Welcome to the Home Page</h1>
      <p>This is the main page of your Next.js app.</p>
    </div>
  );
};

export default Home;
