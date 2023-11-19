import React from 'react';

const Login: React.FC = () => {
  const handleLogin = async () => {
    // Implement logic to initiate 42 intra login
    try {
      // Use a library like `axios` to make a request to your backend
      // which will, in turn, interact with the 42 intra API
      // Example: const response = await axios.post('/api/auth/42login');

      // Handle the response as needed
      console.log('Login initiated');
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <div>
      <h1>Login Page</h1>
      <button id='login-button' onClick={handleLogin}>Sign In with 42</button>
    </div>
  );
};

export default Login;
