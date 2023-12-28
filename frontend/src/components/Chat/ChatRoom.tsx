import React, { useState } from 'react';
import store from "@/redux/store";
import { UserType } from "@/redux/profile";
import { Typography, Avatar, Button } from '@material-tailwind/react';

export const ChatRoom: React.FC = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(!open);
    const user: UserType = store.getState().profile.user;

    return (
        <div className="flex flex-row m-auto max-w-[1200px]">
            <div className="w-1/3 custom-slid-style">
                {/* Content */}
            </div>
            <div className="w-2/3 custom-chat-style">
                <div className="nav-chat-style w-full p-6">
                    <div className="w-full flex flex-row justify-around px-9">
                        <div>
                            <Avatar
                                alt="avatar"
                                className="profile-chat-pic"
                                src={user.avatar}
                            />
                        </div>
                        <div className='p-2'>
                            <Typography className='usernames'>{user.username}</Typography>
                        </div>
                        <div className='justify-around p-2'>
                            <Button
                                onClick={handleOpen}
                                className="challenge-button hidden opacity-70 lg:inline-block transition ease-in-out delay-150 hover:scale-110 hover:shadow-md hover:opacity-100 duration-300 border-1 border-pink rounded-full text-white font-bold px-3 py-2"
                            >
                                Challenge
                            </Button>
                            <Button
                                onClick={handleOpen}
                                className="hidden opacity-70 lg:inline-block transition ease-in-out delay-150 hover:scale-110 hover:shadow-md hover:opacity-100 duration-100 rounded-full px-3 py-3 font-bold m-1"
                            >
                                <svg width="30" height="10" viewBox="0 0 32 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <ellipse cx="4.43836" cy="3.96876" rx="3.875" ry="3.875" fill="#EFEFEF"/>
                                    <ellipse cx="16.063" cy="3.96876" rx="3.875" ry="3.875" fill="#EFEFEF"/>
                                    <ellipse cx="27.6875" cy="3.96876" rx="3.875" ry="3.875" fill="#EFEFEF"/>
                                </svg>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div> 
    );
}
