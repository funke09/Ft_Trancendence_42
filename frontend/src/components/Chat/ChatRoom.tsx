import React, { useState, useEffect } from 'react';
import store from "@/redux/store";
import { UserType } from "@/redux/profile";
import { Typography, Avatar, Button } from '@material-tailwind/react';
import api from '@/api';
import { toast } from 'react-toastify';

export const ChatRoom: React.FC<{ friendID: number }> = ({ friendID }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [friend, setFriend] = useState<any>("");
    const user: UserType = store.getState().profile.user;

    useEffect(() => {
		api.get('user/id/' + friendID)
			.then((res: any) => {
				if (res.status === 200) {
					setFriend(res.data);
				}
			})
			.catch((err) => {
				toast.error(err?.response?.data.message ?? "An Error Occured!", {theme: "dark"});
			})
	}, [])
    
    return (
        <div className="flex flex-row justify-center custom-chat-style w-[900px]" >
        <div className='nav-chat-style w-full p-6'>
            <Avatar 
            alt='avatar'
            className='profile-chat-pic'
            src={friend.avatar}
            />
            
        </div>
        </div>
    );
}

