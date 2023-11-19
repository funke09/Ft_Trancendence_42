import React from 'react';
import { useAuth } from './AuthProvider';

const Login: React.FC = () => {
  const { signInWith42 } = useAuth();

  const handleLogin = () => {
    // Call signInWith42 when the login button is clicked
    signInWith42();
  };

  return (
    <div>
      <h2>Login</h2>
      <button onClick={handleLogin}>Sign In with 42</button>
    </div>
  );
};

export default Login;
