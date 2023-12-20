import api from '@/api';
import React, { useState } from 'react'
import {
	Card,
	Input,
	Button,
  } from "@material-tailwind/react";
import { toast } from 'react-toastify';
   
function SigninForm() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
    

	const handleSignup = async (e: any) => {
		e.preventDefault();
		if (!username || !password)
			return ;
		try {
		  const response = await api.post('/auth/signin', {
			username,
			password,
		  });
	  
		  const { access_token } = response.data;
	  
		  if (access_token) {
			window.location.href = '/';
		  } else {
			console.error('Signup failed:', response.data.message);
		  }
		} catch (error: any) {
			toast.error(error?.response.data.messages.toString(), {theme: 'dark'});
		}
	  };
	
	return (
	<>
	   <Card color="transparent" shadow={false}>
		<form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
		  <div className="mb-1 flex flex-col gap-6">
		  <Input
				type="text"
				size="lg"
				color="white"
				label="Username"
				onChange={(e) => setUsername(e.target.value)}
				crossOrigin={undefined}
				className='bg-gray-400 bg-opacity-5'
			/>
			<Input
				type="password"
				size="lg"
				color="white"
				label="Password"
				onChange={(e) => setPassword(e.target.value)}
				crossOrigin={undefined}
				className='bg-gray-400 bg-opacity-5'
			/>
		  </div>
		  <Button onClick={handleSignup} className="mt-6 transition ease-in-out delay-150 hover:scale-110 hover:shadow-md hover:opacity-100 duration-300" fullWidth>
			Login
		  </Button>
		</form>
	  </Card>
	</>
	);
  }

export default SigninForm;