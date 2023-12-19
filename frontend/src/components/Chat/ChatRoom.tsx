import { Typography, Button } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
// import './../style/global.css'

export const ChatRoom: React.FC = () => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(!open);
    return (
        <div className="flex p-4">
            <div className="w-1/3 custom-slid-style">
            </div>
            <div className="w-2/3 custom-chat-style ">
                <div className="nav-chat-style w-full  flex justify-between items-center p-2">
                    <div className=' flex items-center'>
                        <svg width="50" height="70" viewBox="0 0 32 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <ellipse cx="4.43836" cy="3.96876" rx="3.875" ry="3.875" fill="#EFEFEF"/>
                            <ellipse cx="16.063" cy="3.96876" rx="3.875" ry="3.875" fill="#EFEFEF"/>
                            <ellipse cx="27.6875" cy="3.96876" rx="3.875" ry="3.875" fill="#EFEFEF"/>
                        </svg>
                        <button
                        onClick={handleOpen}
                        variant="gradient"
                        size="md"
                        color="lightBlue"
                        className='hidden op'
                        >Challenge</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
