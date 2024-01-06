import React, { useEffect, useRef, useState } from 'react';
import store, { addNewMsgToGroup, setCurrentChat } from "@/redux/store";
import { Typography, Avatar, Button, IconButton, Input, Drawer, Dialog, ButtonGroup, Menu, MenuHandler, MenuList, MenuItem } from '@material-tailwind/react';
import chatSocket from "@/sockets/chatSocket";
import { addNewMsgToPrivate } from "@/redux/store";
import { AnyMsgDto, PrivateMsgReq } from './types';
import api from '@/api';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { BlockFriend } from '../User/types';
import gameSocket from '@/sockets/gameSocket';
import QueueModal from '../Game/findGame';

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
	const [friend, setFriend] = useState<any>(chat.otherUser);
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

		api.get('/user/' + chat.otherUser.username)
			.then((res: any) => {
				setFriend(res.data);
			})
			.catch((err: any) => {
				toast.error(err?.response?.data.message ?? "An Error Occured!", {theme: "dark"});
			})

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

	////////////////// SIDEBAR /////////////////////
	const [open, setOpen] = useState(false);
	const [isInvite, setIsInvite] = useState(false);

	const handleOpen = () => setOpen(!open);
	const handleInvOpen = () => setIsInvite(!isInvite);

	//----- BLOCK BUTTON -----//
	const block = () => {
		handleOpen();
		store.dispatch(setCurrentChat(null));
		let body: BlockFriend = {friendID: friend.id}
		api.post('/user/blockFriend', body)
			.then((res: any) => {
				chatSocket.emit("reconnect");
				toast.success(`${friend.username} has been Blocked`, {theme: 'dark'})
			})
			.catch((err: any) => {
				toast.error(err?.response?.data?.messages?.toString(), {theme: 'dark'});
			})
	}

	//----- PLAY BUTTON -----//
	const play = (type: number) => {
		setIsInvite(true);
		gameSocket.emit('invGame', {
			username: friend.username,
			gameType: type,
		});
	}

	const handleCancel = () => {
		setIsInvite(false);
		gameSocket.emit("cancelInvGame", { username: friend.username});
	
	};

	useEffect(() => {
		gameSocket.on("invite-canceled", () => {
			setIsInvite(false);
		});
	})

	return (
        <div className="h-full flex flex-col">
            {/* header */}
			<div className="w-full bg-[#0d4d53]">
				<div className="flex flex-row items-center justify-between p-4 h-auto">
					{/* Left-aligned elements */}
					<div className="flex flex-row items-center">
						<IconButton className='mr-5 justify-start' variant='text' color='white' onClick={() => setSelected(null)}>
							<i className="fas fa-chevron-left"></i>
						</IconButton>
						{friend?.id && (
							<Avatar onClick={() => {router.push(`/profile/${friend.id}`)}} src={friend.avatar} size="md" className='cursor-pointer mr-2'/>
						)}
						<Typography variant="h4" color="white" className="cursor-pointer" onClick={() => {router.push(`/profile/${friend.id}`)}}>
							{friend.username}
						</Typography>
					</div>

					{/* Right-aligned bars icon */}
					<IconButton
						variant='text' onClick={handleOpen} color='white' className='sidebar justify-end text-[1.2rem]'>
						<i className="fa-solid fa-circle-info fa-lg"></i>
					</IconButton>
					<Dialog size='sm' className='bg-primary1 rounded-[15px]' open={open} handler={handleOpen}>
						<div className='flex flex-col items-center my-10 gap-y-4'>
							<Image className='rounded-full' src={friend.avatar} alt='avatar' width={100} height={100}/>
							<Typography variant='h3' color='white'>{friend.username}</Typography>
							<Typography variant='h6' className='text-gray-500'>{friend.email}</Typography>
							<hr className='m-auto w-48 rounded-full opacity-30'/>
							<div className='flex flex-row justify-between gap-x-20'>
								<Button onClick={block} color='red' variant='text' className='flex flex-row text-[16px] transition-all bg-red-500/10 hover:bg-red-500/20 justify-between items-center gap-x-2'>
									<i className="fa-solid fa-ban fa-lg"></i>
									<h1>BLOCK</h1>
								</Button>
								<Menu>
									<MenuHandler>
										<Button color='pink' variant='text' className='flex flex-row text-[16px] bg-pink-500/10 hover:bg-pink-500/20 justify-between items-center gap-x-2'>
											<i className="fa-solid fa-gamepad fa-lg"/>
											<h1>PLAY</h1>
										</Button>
									</MenuHandler>
									<MenuList className='z-[99999] bg-primary1 text-center border-none text-white'>
										<MenuItem onClick={() => play(1)}>CLASSIC</MenuItem>
										<MenuItem onClick={() => play(2)}>MEDIUM</MenuItem>
										<MenuItem onClick={() => play(3)}>HARDCORE</MenuItem>
									</MenuList>
								</Menu>
							</div>
							{ isInvite && 
							<Dialog size="xs" className="bg-[#382A39] p-5 rounded-[30px]" open={isInvite} handler={handleInvOpen}>
								<QueueModal type={"invite"} onCancel={handleCancel}/>
							</Dialog>
							}
						</div>
					</Dialog>
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
