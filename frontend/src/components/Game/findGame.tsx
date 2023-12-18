import { Typography, Button } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';

export default function QueueModal({ type, onCancel } : { type: string, onCancel: any }) {
  const [seconds, setSeconds] = useState(0);
  const [msg, setMsg] = useState("")

  useEffect(() => {
	if (type === "normal")
		setMsg("Finding a Game...");
	else if (type === "invite")
		setMsg("Waiting for Opponent...")
	}, [type]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="container text-white m-auto flex flex-col pb-5 justify-center">
      <Typography variant="h4" className="flex justify-center p-4">
        {msg}
      </Typography>
      <div className="flex items-center justify-center w-full h-full">
        <div className="flex justify-center items-center space-x-1 text-md text-gray-200">
          <svg fill="none" className="w-10 h-10 animate-spin" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <path clipRule="evenodd" d="M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z" fill="#00ECFF" fillRule="evenodd" />
          </svg>
          <Typography className='font-medium '>Time elapsed: {seconds}s</Typography>
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <Button
			color="red"
			className='bg-opacity-75 hover:scale-110 hover:shadow-md hover:bg-opacity-100 duration-200'
			onClick={onCancel}
		>
          Cancel Matchmaking
        </Button>
      </div>
    </div>
  );
}
