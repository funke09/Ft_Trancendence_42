import React, { useState } from 'react';
import store from "@/redux/store";
import { UserType } from "@/redux/profile";
import { Typography, Avatar, Button } from '@material-tailwind/react';

export const ChatRoom: React.FC = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(!open);
    const user: UserType = store.getState().profile.user;

    return (
        <div className="flex flex-row max-w-[1200px] m-auto">
            <div className="w-1/3 custom-slid-style">
                <div className='flex flex-row justify-between m-auto gap-x-10'>
                        <button
                            onClick={handleOpen}
                            className='hidden opacity-70 lg:inline-block transition ease-in-out delay-150 hover:scale-110 hover:shadow-md hover:opacity-100 duration-100 rounded-full px-3 py-3 font-bold m-1'
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" width="49" height="49" viewBox="0 0 49 49" fill="none">
                            <ellipse cx="24.5314" cy="24.5938" rx="24.2188" ry="24.2188" fill="#D9D9D9"/>
                            </svg>
                                <div className='channel-vec'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="26" viewBox="0 0 35 26" fill="none">
                                    <path d="M0.0939941 25.1875V20.7797C0.0939941 19.8877 0.325437 19.0675 0.788324 18.3192C1.25121 17.5709 1.86522 17.0005 2.63036 16.608C4.26843 15.7947 5.93291 15.1844 7.62382 14.7772C9.31473 14.37 11.0321 14.167 12.7758 14.168C14.5196 14.168 16.2369 14.3716 17.9278 14.7788C19.6187 15.186 21.2832 15.7957 22.9213 16.608C23.6875 17.0016 24.302 17.5725 24.7649 18.3208C25.2278 19.0691 25.4587 19.8887 25.4576 20.7797V25.1875H0.0939941ZM28.6281 25.1875V20.4649C28.6281 19.3104 28.3042 18.2017 27.6563 17.1386C27.0085 16.0754 26.0907 15.164 24.9028 14.4041C26.2502 14.5616 27.5184 14.8307 28.7073 15.2117C29.8963 15.5927 31.0059 16.0581 32.0363 16.608C32.9875 17.1328 33.714 17.7163 34.216 18.3586C34.718 19.0008 34.969 19.7029 34.969 20.4649V25.1875H28.6281ZM12.7758 12.5938C11.0321 12.5938 9.53931 11.9772 8.29755 10.7441C7.05578 9.51095 6.4349 8.02856 6.4349 6.29692C6.4349 4.56528 7.05578 3.0829 8.29755 1.84976C9.53931 0.616623 11.0321 5.46691e-05 12.7758 5.46691e-05C14.5196 5.46691e-05 16.0123 0.616623 17.2541 1.84976C18.4958 3.0829 19.1167 4.56528 19.1167 6.29692C19.1167 8.02856 18.4958 9.51095 17.2541 10.7441C16.0123 11.9772 14.5196 12.5938 12.7758 12.5938ZM28.6281 6.29692C28.6281 8.02856 28.0072 9.51095 26.7654 10.7441C25.5237 11.9772 24.0309 12.5938 22.2872 12.5938C21.9966 12.5938 21.6267 12.5607 21.1775 12.4946C20.7284 12.4285 20.3585 12.3566 20.0679 12.2789C20.7812 11.4394 21.3297 10.5079 21.7133 9.48471C22.0969 8.46147 22.2882 7.39887 22.2872 6.29692C22.2872 5.19497 22.0959 4.13237 21.7133 3.10913C21.3308 2.08589 20.7823 1.15448 20.0679 0.314898C20.4377 0.183713 20.8076 0.0981811 21.1775 0.058301C21.5474 0.0184208 21.9173 -0.000994809 22.2872 5.46691e-05C24.0309 5.46691e-05 25.5237 0.616623 26.7654 1.84976C28.0072 3.0829 28.6281 4.56528 28.6281 6.29692Z" fill="#111010"/>
                                    </svg>
                                </div>
                        </button>
                        <button
                            onClick={handleOpen}
                            className='hidden opacity-70 lg:inline-block transition ease-in-out delay-150 hover:scale-110 hover:shadow-md hover:opacity-100 duration-100 rounded-full px-3 py-3 font-bold m-1'
                            q>
                            <svg xmlns="http://www.w3.org/2000/svg" width="49" height="49" viewBox="0 0 49 49" fill="none">
                            <ellipse cx="24.5314" cy="24.5938" rx="24.2188" ry="24.2188" fill="#D9D9D9"/>
                            </svg>
                            <div className='user-vec'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="26" viewBox="0 0 35 26" fill="none">
                                <path d="M22.5838 12.6818C26.0872 12.6818 28.9247 9.84428 28.9247 6.34093C28.9247 2.83757 26.0872 1.43051e-05 22.5838 1.43051e-05C19.0805 1.43051e-05 16.2429 2.83757 16.2429 6.34093C16.2429 9.84428 19.0805 12.6818 22.5838 12.6818ZM8.3168 9.51138V4.7557H5.14634V9.51138H0.390659V12.6818H5.14634V17.4375H8.3168V12.6818H13.0725V9.51138H8.3168ZM22.5838 15.8523C18.3513 15.8523 9.90202 17.9765 9.90202 22.1932V25.3637H35.2657V22.1932C35.2657 17.9765 26.8164 15.8523 22.5838 15.8523Z" fill="#111010"/>
                                </svg>
                            </div>
                        </button>
                </div>
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
