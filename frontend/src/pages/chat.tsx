import React, { useEffect, useState } from "react";
import { Nav } from "@/components/Layout/NavBar";
import api from "@/api";
import Loading from "@/components/Layout/Loading";
import store, { setProfile } from "@/redux/store";
import {UserChatRoom} from "@/components/Chat/UserChatRoom";
import ChannelChatRoom from "@/components/Chat/ChannelChatRoom";
import ChatList from "@/components/Chat/ChatList";

const Chat: React.FC = () => {
	const user: any = store.getState().profile.user;
	const [loading, setLoading] = useState(true);
	const [chat, setChat] = useState<any>(null);
	const [group, setGroup] = useState<any>(null);

	useEffect(() => {
		setChat(store.getState().chat.currentChat);
		setGroup(store.getState().chat.currentChatGroup);

		store.subscribe(() => {
			const chatt = store.getState().chat.currentChat;
			if (chatt) {
				setChat(chatt);
				setGroup(null);
			}

			const groupp = store.getState().chat.currentChatGroup;
			if (groupp) {
				setGroup(groupp);
				setChat(null);
			}

			if (!chatt && !groupp) {
				setChat(null);
				setGroup(null);
			}
		})
	}, [])
	
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

    return (
        <>
		<Nav/>
			<div className="flex m-auto w-[1200px] h-[720px] bg-gradient-to-t from-[#137882] to-[#146871] opacity-75 rounded-[15px] shadow-md">
				<section className="w-1/4 h-full bg-primary1 rounded-s-[15px]">
					<ChatList/>
				</section>
				<section className="w-3/4 max-h-[720px]">
					{chat && <UserChatRoom user={user} setSelected={setChat} chat={chat} key={chat && chat.privateChannelId}/>}
					{group && <ChannelChatRoom user={group} setSelected={setGroup} chat={group} key={group && group.id}/>}
				</section>
			</div>
		</>
    );
};

export default Chat;
