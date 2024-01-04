import { ListItem, Tooltip, ListItemPrefix, avatar, Typography, Input, Dialog, Button, DialogBody } from '@material-tailwind/react';
import React, { useState } from 'react'
import { JoinChannelDto } from './types';
import api from '@/api';
import chatSocket from '@/sockets/chatSocket';
import { toast } from 'react-toastify';

const JoinChannel = ({channel, setOpen} : {channel: any, setOpen: any}) => {
	const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
	const [password, setPassword] = useState("");
 
	const joinChannel = (password: string) => {
		let payload: JoinChannelDto = {
			channelID: channel.id,
			password: password == "" ? null : password,
		};
		console.log(payload);
		api.post('/user/joinChannel', payload)
			.then((res: any) => {
				if (res.status === 201) {
				   chatSocket.emit("reconnect");
				   setShowPasswordPrompt(false);
				   setOpen(false);
				}
			})
			.catch((err: any) => {
				toast.error(err?.response?.data?.messages?.toString(), {theme: 'dark'});
			})
	}
 
	const handleJoinClick = () => {
		if (channel.type === 'protected') {
			setShowPasswordPrompt(true);
		} else {
			joinChannel('');
		}
	}
	
	const avatar: string = channel.name.charAt(0);

	return (
		<>
			<ListItem className="text-white" onClick={handleJoinClick}>
				<Tooltip content={channel.type} className="bg-opacity-50">
					<ListItemPrefix>
						<img 
						src={`https://via.placeholder.com/100/413040/e3e3e3?text=${avatar.toUpperCase()}`}
						alt="Avatar" 
						width={60}
						height={60}
						className="rounded-full"
						/>
					</ListItemPrefix>
				</Tooltip>
				<Typography variant="h6">
					{channel.name}
				</Typography>
			</ListItem>
			{showPasswordPrompt && (
			<Dialog size="xs" className="bg-primary1 rounded-[30px]" open={showPasswordPrompt} handler={() => setShowPasswordPrompt(false)}>
				<DialogBody className='flex flex-col m-auto items-center justify-center h-[200px] w-[200px] gap-5'>
					<Input variant='static' color='white' type='password' placeholder="Enter Password" onChange={(e) => setPassword(e.target.value)} crossOrigin={undefined} />
						<Button
							color='green'
							onClick={() => {joinChannel(password); setShowPasswordPrompt(false)}}>
							Join
						</Button>
				</DialogBody>
               </Dialog>
           )}
		</>
 	)
}

export default JoinChannel