import React, { useEffect, useState } from "react";
import { Nav } from "@/components/Layout/NavBar";
import api from "@/api";
import Loading from "@/components/Layout/Loading";
import store, { setProfile } from "@/redux/store";
import { ChatRoom } from "@/components/Chat/ChatRoom";
import { IconButton, List, Tab, TabPanel, Tabs, TabsBody, TabsHeader, Typography } from "@material-tailwind/react";
import FriendList from "@/components/Chat/FriendList";
import AddButton from "@/components/Chat/AddButton";
import ChannelButton from "@/components/Chat/ChannelButton";
import ChannelList from "@/components/Chat/ChannelList";
import chatSocket from "@/sockets/chatSocket";
import { ChannelSearchDto, UserSearchDto } from "@/components/Chat/types";

const Chat: React.FC = () => {
	const [loading, setLoading] = useState(true);
	const [openAdd, setOpenAdd] = useState(false);
	const [openChannel, setOpenChannel] = useState(false);
	const user: any = store.getState().profile.user;
	const Friends = user.Friends.filter((friend: any) => friend.status === 'Accepted');
	const Channels = user.channels.filter((channel: any) => channel.banned !== user.id);
	const [userQuery, setUserQuery] = useState("");
	const [channelQuery, setChannelQuery] = useState("");
	const [searchRes, setSearchRes] = useState([]);
	const [activeTab, setActiveTab] = useState("friends");
	
	const clickOpenAdd = () => setOpenAdd(!openAdd);
	const clickOpenChannel = () => setOpenChannel(!openChannel);
	
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

		if (userQuery) {
			const payload:UserSearchDto = {userQuery};
			chatSocket.emit('userSearchQuery', payload);
		  
			chatSocket.on('search', (result) => {
			  setSearchRes(result);
			});
		}
		else
			setSearchRes([]);

		if (channelQuery) {
			const payload:ChannelSearchDto = {channelQuery};
			chatSocket.emit('channelSearchQuery', payload);

			chatSocket.on('search', (result) => {
				setSearchRes(result);
			});
		}
		else
			setSearchRes([]);

	}, [userQuery, channelQuery]);


	if (loading) {
		return(<Loading/>);
	}

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
								<Tab className="text-white" value="friends" onClick={() => {setActiveTab("friends"); setUserQuery(""); setChannelQuery("")}}>Friends</Tab>
								<Tab className="text-white" value="channels" onClick={() => {setActiveTab("channels"); setUserQuery(""); setChannelQuery("")}}>Channels</Tab>
							</TabsHeader>
							<TabsBody>
								<TabPanel value="friends" className="px-0 overflow-y-auto max-h-[660px] notif">
									<div className='mx-12'>
										<div className="relative flex items-center w-full h-8 rounded-full focus-within:shadow-lg bg-white overflow-hidden">
											<div className="grid place-items-center h-full w-8 pl-4 text-gray-500">
												<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
												</svg>
											</div>
											<input
											className="peer h-full w-full outline-none pl-4 text-[14px] text-gray-700 pr-2"
											type="text"
											value={userQuery} 
              								onChange={e => {setUserQuery(e.target.value); if (!e.target.value) setUserQuery('')}}
											placeholder="Search..." /> 
										</div>
									</div>
									<List className="justify-start items-start">
										{userQuery ? 
											(searchRes.length !== 0 ?
												searchRes.map((res: any) => {return <FriendList key={res.id} id={res.id}/>})
												: 
												<Typography variant="h3" className="justify-center self-center py-40 text-gray-500">No Results</Typography>
											)
											:
											(Friends.length !== 0 ?
												Friends.reverse().map((friend: any) => {return <FriendList key={friend.friendID} id={friend.friendID}/>})
												:
												<Typography variant="h3" className="justify-center self-center py-40 text-gray-500">No Friends</Typography>
											) 
										}
									</List>
								</TabPanel>
								<TabPanel value="channels" className="px-0 overflow-y-auto max-h-[660px] notif">
										<div className='mx-12'>
											<div className="relative flex items-center w-full h-8 rounded-full focus-within:shadow-lg bg-white overflow-hidden">
												<div className="grid place-items-center h-full w-8 pl-4 text-gray-500">
													<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
													</svg>
												</div>
												<input
												className="peer h-full w-full outline-none pl-4 text-[14px] text-gray-700 pr-2"
												type="text"
												value={channelQuery} 
												onChange={e => {setChannelQuery(e.target.value); if (!e.target.value) setChannelQuery('')}}  
												placeholder="Search..." /> 
											</div>
										</div>
										<List className="justify-start items-start">
											{channelQuery ? 
												(searchRes.length !== 0 ?
													searchRes.map((res: any) => {return <ChannelList key={res.id} channel={res}/>})
													:
													<Typography variant="h3" className="justify-center self-center py-40 text-gray-500">No Results</Typography>
												)
												:
												(Channels.length !== 0 ? 
													Channels.reverse().map((channel: any) => {return <ChannelList key={channel.id} channel={channel}/>})
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
					{/* Chat Room */}
				</section>
			</div>
			{openAdd && <AddButton open={openAdd} setOpen={setOpenAdd}/>}
			{openChannel && <ChannelButton open={openChannel} setOpen={setOpenChannel}/>}
		</>
    );
};

export default Chat;
