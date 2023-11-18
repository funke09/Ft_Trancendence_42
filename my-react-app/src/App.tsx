import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

function MyApp() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch data from NestJS API
    fetch('http://localhost:3000/api/hello')
      .then((response) => response.json())
      .then((data) => setMessage(data));
  }, []);

  return (
    <div>
      <h1>{message}</h1>
    </div>
  );
}

export default MyApp;
