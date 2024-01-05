import store, { addNewMsgToGroup } from '@/redux/store';
import chatSocket from '@/sockets/chatSocket';
import { IconButton, Avatar, Typography, Input } from '@material-tailwind/react';
import router from 'next/router';
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify';
import { AnyMsgDto } from './types';

function Message({ msg, user }: { msg: any, user: any }) {
	console.log(msg);
	const isCurrentUser = user.id !== msg.fromId;
    const bgColor = isCurrentUser ? 'bg-[#26b5c5]' : 'bg-[#155e66]';
    const borderRadiusClass = isCurrentUser
      ? 'rounded-br-lg rounded-s-lg'
      : 'rounded-bl-lg rounded-e-lg';
  return (
		<div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
        	<div className={`px-2 py-1 min-w-[70px] ${isCurrentUser ? 'text-end' : 'text-start'} ${bgColor} max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg 2xl:max-w-xl ${borderRadiusClass}`}>
              <Typography className="text-[12px] text-gray" variant="lead">
                 {isCurrentUser ? msg.user.username : 'You'}
              </Typography>
              <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                <Typography className="text-[16px] text-white" variant="lead">
                    {msg.text}
                </Typography>
              </div>
          </div>
      </div>
  );
}

export function ChannelChatRoom({user, setSelected, channel} : {user: any, setSelected: any, channel: any}) {
	const [chat, setChat] = useState<any>(channel);
	const [messages, setMessages] = useState<any>([]);
    const scrollRef = useRef<Readonly<HTMLDivElement> | null>(null);
	const channelAvatar: string = `https://via.placeholder.com/100/413040/e3e3e3?text=${channel.name.charAt(0).toUpperCase()}`

	useEffect(() => {
		if (!chatSocket.connected) chatSocket.connect();
		
		setMessages(chat?.msgs)

		store.subscribe(() => {
			setChat(store.getState().chat.GroupChats.find((chat: any) => chat.id === channel.id));
		});

		chatSocket.on("PublicMsg", (data: any) => {
			if (data?.status) {
				toast.error(data.message, {theme:'dark'});
				setMessages((prev: any) => prev.slice(0, prev.length - 1));
				return ;
			}
			const newMsg = {
				text: data.text,
				createdAt: new Date(),
				fromId: data.fromId,
				user: {
					avatar: data.avatar,
					username: data.username,
				},
				toUsername: data.toUsername,
				channelId: data.channelId,
			};

			if (data?.channelId === chat?.id)
				setMessages((prev: any) => [...prev, newMsg]);
			console.log('msg:', newMsg);
		});


		return (() => {
			setMessages([]);
		});
	}, [chat]);

	useEffect(() => {
        const lastMsg = scrollRef.current?.lastElementChild;
        lastMsg?.scrollIntoView();
    }, [messages]);

	if (!chat) return null;


	///////////// SEND MSG ///////////////
	const [msg, setMsg] = useState("");

	const sendMsg = (msg: any) => {
		msg.message = msg.message.trim();
		if (!msg || msg.message === "") return;

		chatSocket.emit("PublicMsg", {
			id: chat.id,
			text: msg.message,
		});

		const newMsg = {
			text: msg.message,
			createdAt: new Date(),
			fromId: user.id,
			user: {
				avatar: user.avatar,
				username: user.username,
			},
			toUsername: user.username,
			channelId: chat.id,
		};
		console.log('send msg:', newMsg);
		setMessages((prev: any) => [...prev, newMsg]);
		store.dispatch(addNewMsgToGroup(newMsg));
		setMsg("");
	};

	return (
		<div className="flex flex-col h-full">
			{/* header */}
			<div className="flex justify-start items-center p-4 bg-[#0d4d53]">
				<IconButton className='mr-5' variant="text" color="white" onClick={() => setSelected(null)}>
					<i className="fas fa-chevron-left"></i>
				</IconButton>
				<Avatar src={channelAvatar} size="md" className="mr-4" />
				<Typography variant="h5" color="white">
					{chat.name}
				</Typography>
			</div>

			{/* messages */}
			<div className="flex-1 overflow-y-auto notif p-4" ref={scrollRef}>
				{messages.map((msg: AnyMsgDto, index: number) => {
					return (
						<div key={index} className='mb-5'>
							<Message msg={msg} user={user} />
						</div>
					)
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
						if (e.key === "Enter") sendMsg({ message: msg, from: "me" });
					}}
					crossOrigin={undefined}/>
                <IconButton
                    color="pink"
                    size="md"
                    onClick={() => {
                        sendMsg({
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
}
