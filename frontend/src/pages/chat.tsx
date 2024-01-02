import React, { useEffect, useState } from "react";
import { Nav } from "@/components/Layout/NavBar";
import api from "@/api";
import Loading from "@/components/Layout/Loading";
import store, { setProfile } from "@/redux/store";
import { ChatRoom } from "@/components/Chat/ChatRoom";
import { IconButton, List, ListItem, ListItemPrefix, Menu, MenuHandler, MenuItem, MenuList, Tooltip, Typography } from "@material-tailwind/react";
import Image from "next/image";
import FriendList from "@/components/Chat/FriendList";
import AddButton from "@/components/Chat/AddButton";
import ChannelButton from "@/components/Chat/ChannelButton";

const Chat: React.FC = () => {
	const [loading, setLoading] = useState(true);
	const [openAdd, setOpenAdd] = useState(false);
	const [openChannel, setOpenChannel] = useState(false);
	const user: any = store.getState().profile.user;
	const Friends = user.Friends.filter((friend: any) => friend.status === 'Accepted');
	const Channels = user.channels.filter((channel: any) => channel.banned !== user.id);

	const [selectedFriend, setSelectedFriend] = useState(null);

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
            .catch((err: any) => {
                window.location.href = "/login";
            });
    }, []);

	if (loading) {
		return(<Loading/>);
	}

    return (
        <><Nav/>
			<div className="flex m-auto w-[1200px] h-[720px] bg-gradient-to-t from-[#137882] to-[#146871] opacity-75 rounded-[15px] shadow-md">
				<section className="w-1/4 bg-primary1 rounded-s-[15px] flex flex-col">
					<div className="add-buttons flex flex-row items-center justify-evenly my-6">
						<div className="flex flex-col justify-center items-center gap-2 hover:transition-all duration-200 ease-in-out hover:scale-105 hover:opacity-100">
							<Tooltip placement="top" content='Add Friend' className='bg-[#807381] opacity-30'>
								<IconButton onClick={clickOpenAdd} className="bg-gray-100 bg-opacity-25" size="lg">
									<i className="fa-solid fa-user-plus fa-lg"/>
								</IconButton>
							</Tooltip>
						</div>
						<div className="flex flex-col justify-center items-center gap-2 hover:transition-all duration-200 ease-in-out hover:scale-105 hover:opacity-100">
							<Tooltip placement="top" content='Create Channel' className='bg-[#807381] opacity-30'>
								<IconButton onClick={clickOpenChannel} className="bg-gray-100 bg-opacity-20" size="lg">
									<i className="fa-solid fa-user-group fa-lg"/>
								</IconButton>
							</Tooltip>
						</div>
					</div>
					<hr className="rounded-full mx-10 opacity-30"/>
					<div className="search-bar self-center mb-3">
						<div className='max-w-[180px]'>
							<div className="relative flex items-center w-full h-8 rounded-b-full focus-within:shadow-lg bg-white overflow-hidden">
								<div className="grid place-items-center h-full w-8 pl-4 text-gray-500">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
									</svg>
								</div>
								<input
								className="peer h-full w-full outline-none pl-4 text-[14px] text-gray-700 pr-2"
								type="text"
								id="search"
								placeholder="Search..." /> 
							</div>
						</div>
					</div>
					<div className="overflow-y-auto h-[450px] notif bg-white bg-opacity-10 mx-1 rounded-3xl">
						<List className="justify-start items-start">
							{Friends.length != 0 ? Friends.reverse().map((friend: any) => {
								return <FriendList id={friend.friendID} />
							})
							: <Typography variant="h3" className="justify-center self-center py-40 text-gray-500">No Friends</Typography>
							}
						</List>
					</div>
					<hr className="rounded-full mx-10 opacity-30 mt-5"/>
					<Menu>
						<MenuHandler>
							<div className="flex flex-row shadow-md transition-all hover:scale-105 gap-x-3 bg-[#5e4763] rounded-full px-6 py-2 justify-center items-center self-center absolute bottom-5 cursor-pointer">
								<Image 
									src={store.getState().profile.user.avatar}
									height={60}
									width={60}
									alt="avatar"
									className="online"
								/>
								<div>
									<Typography color="white" variant="h6">
										{user.username}
									</Typography>
									<Typography color="white" variant="small" className="font-normal opacity-70">
										Change you Status
									</Typography>
								</div>
							</div>
						</MenuHandler>
						<MenuList className="bg-[#5e4763] border-none font-semibold">
							<MenuItem className="text-green-600 text-center">
								Online
							</MenuItem>
							<MenuItem className="text-orange-600 text-center">
								Away
							</MenuItem>
							<MenuItem className="text-red-600 text-center">
								Offline
							</MenuItem>
						</MenuList>
					</Menu>
				</section>
				<section>
					{/* Chat Room */}
					<ChatRoom friendID={4} />
				</section>
			</div>
			{openAdd && <AddButton open={openAdd} setOpen={setOpenAdd}/>}
			{openChannel && <ChannelButton open={openChannel} setOpen={setOpenChannel}/>}
		</>
    );
};

export default Chat;
