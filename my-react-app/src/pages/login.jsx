// pages/login.jsx
import React, { useState } from 'react';
import Link from 'next/link';
import Navigation from '../components/Navigation';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Add your authentication logic here
    console.log(`Login attempt with username: ${username} and password: ${password}`);
    // For a real application, you would typically send a request to your backend for authentication
  };

  return (
    <div style={styles.container}>
      <Navigation />
      <h1 style={styles.heading}>Login</h1>
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
        <button onClick={handleLogin} style={styles.button}>
          Login
        </button>
      </form>
      <p>
        Don't have an account?{' '}
        <Link href="/signup">Sign up</Link>
      </p>
    </div>
  );
};

const styles = {
  container: {
    background: 'linear-gradient(to bottom, #FF111C, #F1112B)',
    color: '#111111',
    padding: '20px',
    minHeight: '100vh',
  },
  heading: {
    color: '#111111', // Dodger Blue color for the heading
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
    color: '#111111',
    padding: '10px',
    cursor: 'pointer',
  },
};

export default Login;
