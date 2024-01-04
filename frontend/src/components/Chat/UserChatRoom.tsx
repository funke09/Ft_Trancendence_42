import React, { useEffect, useRef, useState } from 'react';
import store, { addNewMsgToGroup } from "@/redux/store";
import { Typography, Avatar, Button, IconButton, Input } from '@material-tailwind/react';
import chatSocket from "@/sockets/chatSocket";
import { addNewMsgToPrivate } from "@/redux/store";
import { AnyMsgDto, PrivateMsgReq } from './types';
import api from '@/api';
import { useRouter } from 'next/router';

const Message = ({ msg, friend }: { msg: AnyMsgDto; friend: any }) => {
	const isCurrentUser = friend.id === msg.fromId;
    const bgColor = isCurrentUser ? 'bg-[#26b5c5]' : 'bg-[#155e66]';
    const borderRadiusClass = isCurrentUser
      ? 'rounded-br-lg rounded-s-lg'
      : 'rounded-bl-lg rounded-e-lg';
  
    return (
      <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
        <div className={`px-2 ${bgColor} max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg 2xl:max-w-xl ${borderRadiusClass}`}>
          <div className={`flex py-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
            <Typography className="text-[16px] text-white" variant="lead">
              {msg.text}
            </Typography>
          </div>
        </div>
      </div>
    );
};

export function UserChatRoom({user, setSelected, chat} : {user: any, setSelected: any, chat: any}) {
	const friend = chat.otherUser;
	const [messages, setMessages] = useState<any>([]);
	const [msg, setMsg] = useState("");
    const scrollRef = useRef<Readonly<HTMLDivElement> | null>(null);
	const router = useRouter();

    useEffect(() => {
        if (!chatSocket.connected) chatSocket.connect();

        store.getState().chat.PrivateChats.forEach((chatt: any) => {
            if (chatt.privateChannelId === chat.privateChannelId) {
                setMessages(chat.chat);
            }
        });

        chatSocket.on("msg", (data: AnyMsgDto) => {
            if (data.privateChannelId === chat.privateChannelId) {
                setMessages((prev: any) => [...prev, data]);
            }
        });

		return (() => {
			setSelected(null);
		})
    }, []);
	
	
	///////// SENDING MSG /////////

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
            toId: friend.id,
            fromId: user.id,
            text: msg.message,
            avatar: user.avatar,
            fromUsername: user.username,
            toUsername: friend.username,
            channelId: chat.channelId,
            channelName: chat.channelName,
            updatedAt: new Date(),
        };

        setMessages((prev: any) => [...prev, newMessage]);
        store.dispatch(addNewMsgToPrivate(newMessage));
        setMsg("");
    };

	useEffect(() => {
        const lastMessage = scrollRef.current?.lastElementChild;
        lastMessage?.scrollIntoView();
    }, [messages]);

	return (
        <div className="h-full flex flex-col">
            {/* header */}
            <div className="w-full bg-[#0d4d53]">
                <div className="flex flex-row justify-start items-center p-4 h-auto">
                    <IconButton className='mr-5' variant='text' color='white' onClick={() => setSelected(null)}>
                        <i className="fas fa-chevron-left"></i>
                    </IconButton>
                    {friend?.id && <Avatar onClick={() => {router.push(`/profile/${friend.id}`)}} src={friend.avatar} size="md" className='cursor-pointer'/>}
                    <div className="flex justify-between items-center">
                        <div
                            className="ml-2 cursor-pointer"
                            onClick={() => {
                                router.push(`/profile/${friend.id}`);
                            }}
                        >
                            <Typography variant="h4" color="white">
                                {friend.username}
                            </Typography>
                        </div>
                        {/* {isMobile || 1 ? <PrivateChatMenu user={friend} /> : null} */}
                    </div>
                </div>
            </div>

            {/* messages */}
            <div
                className="px-10 pt-3 flex-1 overflow-y-scroll notif"
                ref={scrollRef}
            >
			{messages.map((message: any, index: number) => {
				return (
					<div key={index} className="mb-5">
						<Message msg={message} friend={friend} />
					</div>
				);
			})}
            </div>

            {/* input */}
            <div className="flex justify-center gap-2 items-center p-4">
                <Input
					className="w-full outline-none text-white"
					placeholder="Type a Message..."
					color='white'
					value={msg}
					onChange={(e) => setMsg(e.currentTarget.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") sendMessage({ message: msg, from: "me" });
					}}
					crossOrigin={undefined}/>
                <IconButton
                    color="pink"
                    size="md"
                    onClick={() => {
                        sendMessage({
                            message: msg,
                            from: "me",
                        });
                    }}
                >
                	<i className="fa-solid fa-arrow-right fa-lg"/>
                </IconButton>
            </div>
        </div>
	);
};
