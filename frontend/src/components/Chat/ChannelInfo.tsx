import chatSocket from '@/sockets/chatSocket';
import { Badge, Typography, Card, List, IconButton, Button, Dialog, Input, Chip } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react'
import Loading from '../Layout/Loading';
import ChannelMembers from './ChannelMembers';
import api from '@/api';
import { ToastContainer, toast } from 'react-toastify';
import { LeaveChannelDto, UpdatePasswordDto, addChannelMemberDto } from './types';
import store, { setCurrentChatGroup } from '@/redux/store';

const ChannelSettings = ({chat, handle} : {chat:any, handle: any}) => {
	const [password, setPassword] = useState("*********");
	const [type, setType] = useState(chat.type);

	useEffect(() => {
		if (password !== null)
			setType('protected');
		if (password === '')
			setType('public');
	}, [password]);
	
	const changePassword = ({ target } : {target: any}) => {
		setPassword(target.value);
	}

	function savePassword(password: string) {
		let body: UpdatePasswordDto = {
			channelId: chat.id,
			newPassword: password,
		}
		api.post('/user/channelPassword', body)
			.then((res: any) => {
				handle();
				toast.success("Channel Password has been updated")
			})
			.catch((err: any) => {
				toast.error(err?.response?.data.message ?? "An Error Occurred!", { theme: "dark" });
			})
	}

	return (
		<div className='flex w-full h-full flex-col m-auto items-center my-10 gap-y-10 transition-all duration-300'>
			<div className="flex flex-row justify-around gap-y-10">
				<Chip value={'public'} className={`${type === 'public' ? 'bg-green-500' : 'bg-white/10'}`}/>
				<Chip value={'protected'} className={`${type === 'protected' ? 'bg-green-500' : 'bg-white/10'}`}/>
			</div>
			<div className="relative flex w-full max-w-[20rem]">
				<Input
					size="lg"
					value={password}
					variant="standard"
					color="white"
					label="Password"
					type="password"
					onChange={changePassword}
					crossOrigin={undefined}
					containerProps={{className: "min-w-0",}}
					className='text-white'
				/>
				<Button
					size="sm"
					onClick={() => savePassword(password)}
					color={password !== "*********" ? "green" : "blue-gray"}
					disabled={password == "*********"}
					className="!absolute right-1 top-1 rounded">
				SAVE
				</Button>
			</div>
		</div>
	)
}

const ChannelInfo = ({chat, channelAvatar, manager} : {chat: any, channelAvatar: string, manager: boolean}) => {
	const [loading, setLoading] = useState(false);
	const [members, setMembers] = useState<any>([]);
	const [refresh, setRefresh] = useState<boolean>(false);

	useEffect(() => {
		getMembers();
		chatSocket.emit('reconnect');

		return () => {}
	}, [refresh])

	function getMembers() {
		api.get(`/user/channelMembers/${chat.id}`)
			.then((res: any) => {
				setMembers([...res.data]);
			})
			.catch((err: any) => {
				toast.error(err?.response?.data?.messages?.toString(), {theme: 'dark'});
			})
	}

	function leaveChannel() {
		let body: LeaveChannelDto = {
			channelID: chat.id,
		};
		api.post('/user/leaveChannel', body)
			.then((res: any) => {
				toast.success(`You left ${chat.name}`, {theme: 'dark'});
				chatSocket.emit('reconnect');
				store.dispatch(setCurrentChatGroup(null));
			})
			.catch((err: any) => {
				toast.error(err?.response?.data?.messages?.toString(), {theme: 'dark'});
			})
	}

	function removeChannel() {
		api.post(`/user/removeChannel/${chat.id}`)
			.then(() => {
				toast.success(`${chat.name} was Deleted`, {theme: 'dark'});
				chatSocket.emit('reconnect');
				store.dispatch(setCurrentChatGroup(null));
			})
			.catch((err: any) => {
				toast.error(err?.response?.data?.messages?.toString(), {theme: 'dark'});
			})
	}

	const [open, setOpen] = useState(false);
	const [username, setUsername] = useState("");
	const onChange = ({ target }: any) => setUsername(target.value);

	function addMember() {
		let body: addChannelMemberDto = {
			username: username,
			channelID: chat.id,
		};

		api.post('/user/addChannelMember', body)
			.then((res) => {
				toast.success(`${username} has been added to ${chat.name}`, {theme: 'dark'});
	
				// Update members state to include the new member
				setMembers([...members, res.data.userToAdd]);
	
				// Reset the username input and close the dialog
				setUsername("");
				setOpen(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data?.messages?.toString(), {theme: 'dark'});
			});
	}

	const [openSettings, setOpenSettings] = useState(false);
	const handleSettings = () => setOpenSettings(!openSettings);
	const user = store.getState().profile.user;
	const [isBanned, setIsBanned] = useState(false);

	useEffect(() => {
		api.get(`/user/isBanned/${user.id}/${chat.id}`)
			.then((res: any) => {
				setIsBanned(res.data);
			})
			.catch((err: any) => {
				toast.error(err?.response?.data.message ?? "An Error Occurred!", { theme: "dark" });
			})
	}, [isBanned])

	return (
		<div className='flex flex-col items-center w-full my-5 gap-y-2'>
			{chat.ownerId === store.getState().profile.user.id &&
				<div className='absolute right-3 z-[20] transition-all duration-300 hover:scale-110'>
					<IconButton onClick={handleSettings} color='white' variant='text' className='rounded-full text-[14px] bg-white/10 hover:bg-white/20'>
						<i className="fa-solid fa-gear fa-lg"></i>
					</IconButton>
					{openSettings &&
						<Dialog size='xs' open={openSettings} handler={handleSettings} className='bg-primary1 rounded-[30px]'>
							<ChannelSettings handle={handleSettings} chat={chat} />
						</Dialog>
					}
				</div>
			}
			<Badge className='bg-white/10' placement='bottom-end' content={
				<i className={`fa-solid ${
					chat.type === 'protected' ? 'fa-lock' :
					chat.type === 'private' ? 'fa-eye-slash' :
					chat.type === 'public' ? 'fa-globe' : ''
				}`} />
			}>
				<img src={channelAvatar} width={100} height={100} alt='channel' className='rounded-full'/>
			</Badge>
			<Typography variant='h3' color='white'>{chat?.name}</Typography>
			<Card className="rounded-[15px] bg-[#472C45] w-[58%] h-[300px] mt-2">
				{loading ? <Loading/> :
					<List className='notif overflow-y-auto max-h-[300px]'>
						<Typography variant='h5' className='text-white/50 text-center' >Members</Typography>
						<hr className='m-auto w-32 rounded-full opacity-30'/>	
						<ChannelMembers manager={manager} members={members} channel={chat}/>
					</List>
				}
				{(manager && !isBanned) &&
					<div className="absolute top-2 right-3 z-[20] transition-all duration-300 hover:rotate-180">
						<IconButton color="pink" size= "sm" className="rounded-full" onClick={() => setOpen(!open)}>
							<i className="fa-solid fa-plus"/>
						</IconButton>
						{open &&
							<Dialog size="xs" open={open} handler={() => setOpen(!open)} className='bg-primary1 h-[300px] rounded-[15px] border-none focus:outline-none'>
								<ToastContainer/>
								<div className='flex w-1/2 flex-col p-4 items-center m-auto my-[2.5rem] gap-y-10'>
									<Typography variant='h4' color='white'>Add to channel: </Typography>
										<Input
											type="text"
											label="Username"
											value={username}
											onChange={onChange}
											color="white"
											containerProps={{
											className: "min-w-0",
										}} crossOrigin={undefined}/>
									<Button disabled={!username} onClick={addMember} variant='gradient' color='pink' className='opacity-80 hover:opacity-100 transition-all hover:scale-105'>ADD</Button>
								</div>
							</Dialog>
						}
					</div>
				}
			</Card>
			<div className='flex flex-row w-[75%] justify-around items-center mt-2'>
				<Button onClick={leaveChannel} color='red' variant='text' className='flex flex-row text-[16px] transition-all bg-red-500/10 hover:bg-red-500/20 justify-between items-center gap-x-2'>
					<i className="fa-solid fa-arrow-right-from-bracket"/>
					<h1>Leave</h1>
				</Button>
				{store.getState().profile.user.id === chat.ownerId &&
				<Button onClick={removeChannel} color='red' variant='text' className='flex flex-row text-[16px] transition-all bg-red-500/10 hover:bg-red-500/20 justify-between items-center gap-x-2'>
					<i className="fa-solid fa-trash"/>
					<h1>Remove</h1>
				</Button>
				}
			</div>
		</div>
	)
}

export default ChannelInfo