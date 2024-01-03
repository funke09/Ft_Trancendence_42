import api from '@/api';
import { Button, Card, Dialog, Input, List, Switch, Tab, TabPanel, Tabs, TabsBody, TabsHeader, Typography } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react'
import { ChannelSearchDto, CreateChannelDto } from './types';
import { ToastContainer, toast } from 'react-toastify';
import ChannelList from './ChannelList';
import chatSocket from '@/sockets/chatSocket';

const ChannelButton = ({ open, setOpen } : {open: boolean, setOpen:React.Dispatch<React.SetStateAction<boolean>>}) => {
	const [isProtected, setIsProtected] = useState(false);
	const [isPrivate, setIsPrivate] = useState(false);
	const [channelName, setChannelName] = useState("");
	const [password, setPassword] = useState("");
	const [type, setType] = useState("public");
	const [activeTab, setActiveTab] = useState("create");
	const [channelQuery, setChannelQuery] = useState("");
	const [searchRes, setSearchRes] = useState([]);
	const [selectedChannel, setSelectedChannel] = useState(null);

	const openHandler = () => setOpen(!open);

	const handleChannelSelect = (channel: any) => {
		setSelectedChannel(channel);
	};

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
				if (res.status === 201) {
					toast.success('Channel Created', {theme:'dark'})
					chatSocket.emit('reconnect');
					setOpen(!open);
				}
			})
			.catch((err) => {
				toast.error(err?.response?.data.message ?? "An Error Occured!", {theme: "dark"});
			})
	}

	// if (selectedChannel) {
	// 	api.post('user/joinChannel', selectedChannel)
	// }

	useEffect(() => {
		if (channelQuery) {
			const payload: ChannelSearchDto = {channelQuery};
			chatSocket.emit('searchAllChannels', payload);

			chatSocket.on('search', (result) => {
				setSearchRes(result);
			})
		}
		else
			setSearchRes([]);

	  }, [setOpen, channelQuery]);

  return (
	<Dialog size='sm' open={open} handler={openHandler} className='bg-primary1 rounded-[15px] border-none'>
		<Tabs value={activeTab}>
			<TabsHeader
				className="bg-transparent p-2"
				indicatorProps={{
				className: "bg-gray-900/50 shadow-none !text-gray-900",}}
			>
				<Tab className="text-white" value="create" onClick={() => {setActiveTab("create")}}>Create</Tab>
				<Tab className="text-white" value="join" onClick={() => {setActiveTab("join")}}>Join</Tab>
			</TabsHeader>
			<TabsBody>
				<TabPanel value="create" className="p-0">
					<Card color='transparent' className='flex flex-col items-center h-[330px]'>
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
								<div className='flex flex-col gap-x-20 gap-y-3 samwil:flex-row'>
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
				</TabPanel>
				<TabPanel value='join' className='p-0'>
					<Card color='transparent' className='flex flex-col items-center h-[330px]'>
						<form className="mb-2 w-80 items-center">
							<div className="mb-1 flex flex-col gap-2 py-2">
								<div className='flex flex-row items-end'>
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
									</svg>
									<Input
										variant='static'
										size="lg"
										color='pink'
										placeholder="Search..."
										crossOrigin={undefined}
										className="outline-none pl-2 text-[16px] text-white pr-2"
										value={channelQuery} 
										onChange={e => {setChannelQuery(e.target.value); if (!e.target.value) setChannelQuery('')}}
									/>
								</div>
								<div className="bg-white w-80 h-[250px] ml-2 bg-opacity-10 rounded-[15px] overflow-y-auto notif">
									<List className="justify-start items-start">
										{searchRes.length !== 0 ?
											searchRes.map((channel: any) => {return <ChannelList key={channel.id} channel={channel} onSelect={handleChannelSelect}/>})
											: 
											<Typography variant="h3" className="text-gray-500 self-center translate-y-[200%]">No Results</Typography>
										}
									</List>
								</div>
							</div>
						</form>
					</Card>
				</TabPanel>
			</TabsBody>
		</Tabs>
		<ToastContainer/>
	</Dialog>
  )
}

export default ChannelButton