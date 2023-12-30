import api from '@/api';
import { Button, Card, Dialog, Input, Switch, Typography } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react'
import { CreateChannelDto } from './types';
import { ToastContainer, toast } from 'react-toastify';

const ChannelButton = ({ open, setOpen } : {open: boolean, setOpen:React.Dispatch<React.SetStateAction<boolean>>}) => {
	const [isProtected, setIsProtected] = useState(false);
	const [isPrivate, setIsPrivate] = useState(false);
	const [channelName, setChannelName] = useState("");
	const [password, setPassword] = useState("");
	const [type, setType] = useState("public");
	
	const openHandler = () => setOpen(!open);

	const handleIsProtected = (event: any) => {
		setIsProtected(event.target.checked);
		setType('protected');
		if (!event.target.checked) {
			setPassword("");
		  }
	}
	const handleIsPrivate = (event: any) => {
		setIsPrivate(event.target.checked);
		setType('private');
	}

	const handleChannelName = (event: any) => {
		setChannelName(event.target.value);
	}

	const create = () => {
		const body: CreateChannelDto = {
			name: channelName,
			type: type,
			password: password,
		}
		api.post('user/createChannel', body)
			.then((res) => {
				if (res.status === 201)
					toast.success('Channel Created', {theme:'dark'})
			})
			.catch((err) => {
				toast.error(err?.response?.data.message ?? "An Error Occured!", {theme: "dark"});
			})
	}

	// useEffect(() => {
	// 	return () => {
	// 	  setOpen(false);
	// 	};
	//   }, [setOpen]);

  return (
	<Dialog size='sm' open={open} handler={openHandler} className='bg-primary1 rounded-[15px] border-none'>
		<Typography className='text-center pt-4' variant="h4" color="white">
		Create a Channel
		</Typography>
		<hr className='m-auto w-48 rounded-full opacity-30 my-3'/>
		<Card color='transparent' className='flex flex-col items-center'>
			<form className="mb-2 w-80 items-center sm:w-96">
				<div className="mb-1 flex flex-col gap-7 py-2">
					<Input
						variant='static'
						size="lg"
						color='pink'
						value={channelName}
						onChange={handleChannelName}
						placeholder="Channel Name"
						className=" !border-t-blue-gray-200 text-white"
						crossOrigin={undefined}
					/>
					<Switch
							disabled={isProtected}
							onChange={handleIsPrivate}
							checked={isPrivate}
							crossOrigin={undefined}
							color='green'
							label={<Typography className='text-[15px] font-semibold text-gray-300'>Private</Typography>}
						/>
					<div className='flex flex-ro m-auto gap-x-20'>
						<Switch
							disabled={isPrivate}
							onChange={handleIsProtected}
							checked={isProtected}
							crossOrigin={undefined}
							color='green'
							label={<Typography className='text-[15px] font-semibold text-gray-300'>Protected</Typography>}
						/>
						<Input
							type="password"
							size="md"
							color="pink"
							label="Password"
							disabled={!isProtected}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							crossOrigin={undefined}
							className='disabled:bg-gray-500 text-white disabled:opacity-20 bg-opacity-5'
						/>
					</div>
				</div>
			</form>
			<hr className='m-auto w-48 rounded-full opacity-30 my-4'/>
			<Button onClick={create} className="mb-5 text-sm" disabled={!channelName} variant='gradient' color='pink'>
				Create
			</Button>
		</Card>
		<ToastContainer/>
	</Dialog>
  )
}

export default ChannelButton