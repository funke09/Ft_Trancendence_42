import { Tabs, TabsHeader, Tab, TabsBody, TabPanel, List, Typography, IconButton } from '@material-tailwind/react'
import React, { useEffect, useState } from 'react'
import ChannelList from './ChannelList'
import FriendList from './FriendList'
import AddButton from './AddButton'
import ChannelButton from './ChannelButton'
import store from '@/redux/store'
import chatSocket from '@/sockets/chatSocket'

const ChatList = () => {
	const [Friends, setFriends] = useState<any>([]);
	const [Channels, setChannels] = useState<any>([]);
	const [activeTab, setActiveTab] = useState("friends");
	const [openAdd, setOpenAdd] = useState(false);
	const [openChannel, setOpenChannel] = useState(false);
	
	const clickOpenAdd = () => setOpenAdd(!openAdd);
	const clickOpenChannel = () => setOpenChannel(!openChannel);

	useEffect(() => {
		if (!chatSocket.connected) chatSocket.connect();
        chatSocket.emit("reconnect");

        setFriends(store.getState().chat.PrivateChats);
        store.subscribe(() => {
            const chatsFromStore = store.getState().chat.PrivateChats;
            setFriends(() => {
                return chatsFromStore;
            });
        });

		setChannels(store.getState().chat.GroupChats);
		store.subscribe(() => {
			const chatsFromStore = store.getState().chat.GroupChats;
			setChannels(chatsFromStore);
		});

    }, []);
	
	return (
		<div className="w-full h-full flex flex-col relative bg-white bg-opacity-10 m-auto py-2 rounded-s-[15px]">
			<Tabs value={activeTab}>
				<TabsHeader
					className="bg-transparent"
					indicatorProps={{
					className: "bg-gray-900/50 shadow-none !text-gray-900",}}
				>
					<Tab key={'friends'} className="text-white" value="friends" onClick={() => setActiveTab("friends")}>Friends</Tab>
					<Tab key={'channels'} className="text-white" value="channels" onClick={() => setActiveTab("channels")}>Channels</Tab>
				</TabsHeader>
				<TabsBody>
					<TabPanel key={'friends'} value="friends" className="px-0 overflow-y-auto max-h-[660px] notif">
						<List className="justify-start items-start">
							{Friends &&
								(Friends.length !== 0 ?
									[...Friends].reverse().map((friend: any) => {return <FriendList key={friend.privateChannelId} friendObj={friend}/>})
										:
									<Typography variant="h3" className="justify-center self-center py-40 text-gray-500">No Friends</Typography>
								)}
						</List>
					</TabPanel>
					<TabPanel key={'channels'} value="channels" className="px-0 overflow-y-auto max-h-[660px] notif">
						<List className="justify-start items-start">
							{Channels &&
								(Channels.length !== 0 ? 
									[...Channels].reverse().map((channel: any) => {return <ChannelList key={channel.id} channel={channel}/>})
									:
									<Typography variant="h3" className="justify-center self-center py-40 text-gray-500">No Channels</Typography>
								)}
						</List>
					</TabPanel>
				</TabsBody>
			</Tabs>
			<div className="absolute bottom-12 right-8 z-[20] transition-all duration-300 hover:rotate-180">
				{activeTab === 'friends' && (
					<IconButton onClick={clickOpenAdd} color="pink" className="rounded-full">
						<i className="fa-solid fa-plus fa-lg"/>
					</IconButton>
				)}
				{activeTab === 'channels' && (
					<IconButton onClick={clickOpenChannel} color="pink" className="rounded-full">
						<i className="fa-solid fa-plus fa-lg"/>
					</IconButton>
				)}
			</div>
			{openAdd && <AddButton open={openAdd} setOpen={setOpenAdd}/>}
			{openChannel && <ChannelButton open={openChannel} setOpen={setOpenChannel}/>}
		</div>
	)
}

export default ChatList;