// pages/signup.jsx
import React, { useState } from 'react';
import Link from 'next/link';
import Navigation from '../components/Navigation';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    // Add your signup logic here
    console.log(`Signup attempt with username: ${username} and password: ${password}`);
    // For a real application, you would typically send a request to your backend for user registration
  };

  return (
    <div style={styles.container}>
      <Navigation />
      <h1 style={styles.heading}>Sign Up</h1>
      <form style={styles.form} onSubmit={(e) => e.preventDefault()}>
        <label style={styles.label}>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
        </label>
        <button onClick={handleSignup} style={styles.button}>
          Sign Up
        </button>
      </form>
      <p>
        Already have an account?{' '}
        <Link href="/login">Login
        </Link>
      </p>
    </div>
  );
};

const styles = {
  container: {
    background: 'linear-gradient(to bottom, #00C9FF, #92FE9D)',
    color: '#333333',
    padding: '20px',
    minHeight: '100vh',
  },
  heading: {
    color: '#FF1493', // Deep pink color for the heading
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '300px',
    margin: '0 auto',
  },
  label: {
    margin: '10px 0',
  },
  input: {
    padding: '8px',
    margin: '5px 0',
  },
  button: {
    background: '#00FF00', // Lime Green color for the button
    color: '#333333',
    padding: '10px',
    cursor: 'pointer',
  },
};

export default Signup;
