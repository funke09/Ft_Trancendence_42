import store from '@/redux/store';
import React, { useEffect, useState } from 'react'
import ChannelChatRoom from './ChannelChatRoom';
import UserChatRoom from './UserChatRoom';

const ChatRoom = () => {
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

			if (!chatt || !groupp) {
				setChat(null);
				setGroup(null);
			}
		})
	}, [])

  return (
	<>
		{chat && <UserChatRoom user={chat} setSelected={setChat} chat={chat} key={chat && chat.privateChannelId}/>}
		{group && <ChannelChatRoom user={group} setSelected={setGroup} chat={group} key={group && group.id}/>}
	</>
  )
}

export default ChatRoom