import api from '@/api';
import gameSocket from '@/sockets/gameSocket';
import { Button, Card, CardBody, CardFooter, Dialog, Typography } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import Loading from '../Layout/Loading';
import store, { setOpp } from '@/redux/store';
import {useRouter} from 'next/router';

interface InviteData {
	username: string;
	id: number;
	avatar: string;
}

function Invite() {
	const [open, setOpen] = useState(false);
	const [invData, setInvData] = useState<InviteData>({username: "", id: 0, avatar: ""});
	const router = useRouter();

	const handleOpen = () => setOpen(!open);
	
	useEffect(() => {
		if (!gameSocket.connected) gameSocket.connect();

		gameSocket.on('invGame', (data: InviteData) => {
			setInvData(data);
			setOpen(true);
		});

		gameSocket.on('invite-accepted', () => {
			setOpen(false);
		});

		gameSocket.on('invite-canceled', () => {
			setOpen(false);
		});

		return () => {
			setInvData({username: "", id: 0, avatar: ""});
		};
	}, []);

	return (
		<Dialog className='focus:outline-none rounded-[15px]' size='xs' open={open} handler={handleOpen}>
			<Card className='bg-[#3b2a3d] text-gray-50'>
				<CardBody className='gap-y-5'>
					<Typography variant="h5" color="white" className="mb-2 text-center">
						Invited by
					</Typography>
					<div className='flex flex-col m-auto justify-center items-center gap-y-5'>
						<Image className='rounded-full' src={invData.avatar} width={100} height={100} alt='avatar'/>
						<Typography variant='h5'>{invData.username}</Typography>
					</div>
				</CardBody>
				<CardFooter className="flex flex-row justify-around">
					<Button onClick={() => {gameSocket.emit('acceptGame', invData); setOpen(false)}} variant='gradient' color='green'>Accept</Button>
					<Button onClick={() => {gameSocket.emit('rejectInvGame', invData); setOpen(false)}} variant='gradient' color='red'>Decline</Button>
				</CardFooter>
			</Card>
		</Dialog>
	)
}

export default Invite