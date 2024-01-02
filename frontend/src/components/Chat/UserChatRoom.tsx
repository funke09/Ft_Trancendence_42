import React, { useEffect, useState } from 'react';
import store, { addNewMsgToGroup } from "@/redux/store";
import { Typography, Avatar, Button } from '@material-tailwind/react';
import chatSocket from "@/sockets/chatSocket";
import { addNewMsgToPrivate } from "@/redux/store";
import { AnyMsgDto, PrivateMsgReq } from './types';

const UserChatRoom: React.FC<{user: any, chat: any}> = ({ user, chat }) => {
    const friend = chat.otherUser;
	const [messages, setMessages] = useState<any>([]);

	useEffect(() => {
        if (!chatSocket.connected) chatSocket.connect();

        store.getState().chat.PrivateChats.forEach((chat: any) => {
            if (chat.privateChannelId == chat.privateChannelId) {
                setMessages(chat.chat);
            }
        });

        chatSocket.on("msg", (data: AnyMsgDto) => {
            if (data.privateChannelId == chat.privateChannelId) {
                setMessages((prev: any) => [...prev, data]);
            }
        });
    }, []);

	console.log(messages);

	///////// SENDING MSG /////////
	const [msg, setMsg] = useState("");

    const sendMessage = (msg: any) => {
		msg.message = msg.message.trim();
        if (!msg || msg.message === "") return;

        let newMessageReq: PrivateMsgReq = {
            text: msg.message,
            toId: friend.id,
        };

        chatSocket.emit("msg", newMessageReq);

        const newMessage: AnyMsgDto = {
            privateChannelId: chat.privateChannelId,
            createdAt: new Date(),
            receiverId: friend.id,
            senderId: user.id,
            text: msg.message,
            avatar: user.avatar,
            senderUsername: user.username,
            receiverUsername: friend.username,
            channelId: chat.channelId,
            channelName: chat.channelName,
            updatedAt: new Date(),
        };

        setMessages((prev: any) => [...prev, newMessage]);
        store.dispatch(addNewMsgToPrivate(newMessage));
        setMsg("");
    };

	return (
		<>
			<header className="bg-gray-200 p-4 border-b border-gray-300">
				<h2 className="text-lg font-bold">Chat Room</h2>
			</header>
			<section className="flex-grow overflow-auto p-4">
				{messages.map((message: any, index: number) => (
				   <div key={message.updatedAt ?? index} className="mb-4">
					   <Typography variant="small">
						   <strong>{message.senderUsername}:</strong> {message.text}
					   </Typography>
				   </div>
				))}
			</section>
			<footer className="flex justify-between items-center p-4 border-t border-gray-300">
				<input 
					type="text" 
					value={msg} 
					onChange={(e) => setMsg(e.target.value)} 
					placeholder="Type a message..." 
					className="flex-grow mr-4 p-2 border rounded" 
				/>
				<Button onClick={() => sendMessage({message: msg})} color="blue">
					Send
				</Button>
			</footer>
		</>
	);
};

export default UserChatRoom;