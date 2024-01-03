import React, { useEffect, useState } from "react";
import { Nav } from "@/components/Layout/NavBar";
import api from "@/api";
import Loading from "@/components/Layout/Loading";
import store, { setProfile } from "@/redux/store";
import ChatRoom from "@/components/Chat/UserChatRoom";
import { IconButton, List, Tab, TabPanel, Tabs, TabsBody, TabsHeader, Typography } from "@material-tailwind/react";
import FriendList from "@/components/Chat/FriendList";
import AddButton from "@/components/Chat/AddButton";
import ChannelButton from "@/components/Chat/ChannelButton";
import ChannelList from "@/components/Chat/ChannelList";
import chatSocket from "@/sockets/chatSocket";
import { ChannelSearchDto, UserSearchDto } from "@/components/Chat/types";
import UserChatRoom from "@/components/Chat/UserChatRoom";
import ChannelChatRoom from "@/components/Chat/ChannelChatRoom";
import Image from "next/image";

const Chat: React.FC = () => {
	const [loading, setLoading] = useState(true);
	const [openAdd, setOpenAdd] = useState(false);
	const [openChannel, setOpenChannel] = useState(false);
	const user: any = store.getState().profile.user;
	const [Friends, setFriends] = useState<any>([]);
	const [Channels, setChannels] = useState<any>([]);
	const [activeTab, setActiveTab] = useState("friends");
	const [selectedUser, setSelectedUser] = useState<any>(null);
	const [selectedChannel, setSelectedChannel] = useState(null);
	
	const clickOpenAdd = () => setOpenAdd(!openAdd);
	const clickOpenChannel = () => setOpenChannel(!openChannel);

	const handleUserSelect = (user: any) => {
		setSelectedUser(user);
		setSelectedChannel(null);
	};
	
	const handleChannelSelect = (channel: any) => {
		setSelectedChannel(channel);
		setSelectedUser(null);
	};

	useEffect(() => {
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
	
    useEffect(() => {
		api.get("/user/profile")
			.then((res: any) => {
				if (res.status == 200) {
						store.dispatch(setProfile(res.data));
						setLoading(false);
					} else {
						window.location.href = "/";
					}
            })
            .catch(() => {
                window.location.href = "/login";
            });

	}, []);

	if (loading) {
		return(<Loading/>);
	}

	console.log('channels:', Channels);

    return (
        <><Nav/>
			<div className="flex m-auto w-[1200px] h-[720px] bg-gradient-to-t from-[#137882] to-[#146871] opacity-75 rounded-[15px] shadow-md">
				<section className="w-1/4 h-full bg-primary1 rounded-s-[15px]">
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
												Friends.map((friend: any) => {return <FriendList key={friend.privateChannelId} friendObj={friend} onSelect={handleUserSelect}/>})
												:
												<Typography variant="h3" className="justify-center self-center py-40 text-gray-500">No Friends</Typography>
											) 
										}
									</List>
								</TabPanel>
								<TabPanel key={'channels'} value="channels" className="px-0 overflow-y-auto max-h-[660px] notif">
									<List className="justify-start items-start">
										{Channels &&
											(Channels.length !== 0 ? 
												Channels.map((channel: any) => {return <ChannelList key={channel.id} channel={channel} onSelect={handleChannelSelect}/>})
												:
												<Typography variant="h3" className="justify-center self-center py-40 text-gray-500">No Channels</Typography>
											)
										}
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
					</div>
				</section>
				<section>
					{selectedUser && <UserChatRoom user={user} chat={selectedUser}/>}
					{selectedChannel && <ChannelChatRoom channel={selectedChannel}/>}
				</section>
			</div>
			{openAdd && <AddButton open={openAdd} setOpen={setOpenAdd}/>}
			{openChannel && <ChannelButton open={openChannel} setOpen={setOpenChannel}/>}
		</>
    );
};

export default Chat;
