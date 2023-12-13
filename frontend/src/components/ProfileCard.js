// components/ProfileCard.js
// import '@style/ProfileCard.css'
import React from 'react';
import store, { setProfile } from "@/redux/store";
import Image from "next/image";

const ProfileCard = ( {user, fn} ) => {
  return (
    <div className="profile-card"
         onMouseLeave={() => fn(false)}
        >
      <Image
          src={store.getState().profile.user.avatar}
          alt="avatar"
          width={60}
          height={60}
          className="ml-2 rounded-full h-[60px] w-[60px] bg-white flex justify-center items-center shadow-md"
        />
      <p className='text-white 2rem text-blod'>Name: {user.username}</p>
      <p className='text-white 2rem text-blod'>Email: {user.email}</p>
        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M12.5 2.5C10.751 2.49968 9.03241 2.95811 7.5159 3.82953C5.99939 4.70096 4.73797 5.95489 3.85753 7.46619C2.97709 8.97748 2.50844 10.6933 2.49834 12.4423C2.48825 14.1913 2.93707 15.9124 3.80001 17.4337C4.38327 16.6757 5.13305 16.062 5.99136 15.64C6.84968 15.218 7.79355 14.999 8.75 15H16.25C17.2064 14.999 18.1503 15.218 19.0086 15.64C19.867 16.062 20.6167 16.6757 21.2 17.4337C22.0629 15.9124 22.5117 14.1913 22.5017 12.4423C22.4916 10.6933 22.0229 8.97748 21.1425 7.46619C20.262 5.95489 19.0006 4.70096 17.4841 3.82953C15.9676 2.95811 14.249 2.49968 12.5 2.5ZM22.4287 20.095C24.1 17.9162 25.004 15.2459 25 12.5C25 5.59625 19.4037 0 12.5 0C5.59626 0 1.40665e-05 5.59625 1.40665e-05 12.5C-0.00411273 15.246 0.899895 17.9162 2.57126 20.095L2.56501 20.1175L3.00876 20.6337C4.18112 22.0044 5.63674 23.1045 7.2753 23.8583C8.91385 24.6121 10.6964 25.0016 12.5 25C15.0342 25.0046 17.5092 24.2349 19.5937 22.7937C20.4824 22.1797 21.2882 21.4538 21.9912 20.6337L22.435 20.1175L22.4287 20.095ZM12.5 5C11.5054 5 10.5516 5.39508 9.84835 6.09834C9.14509 6.80161 8.75 7.75543 8.75 8.74999C8.75 9.74455 9.14509 10.6984 9.84835 11.4016C10.5516 12.1049 11.5054 12.5 12.5 12.5C13.4946 12.5 14.4484 12.1049 15.1516 11.4016C15.8549 10.6984 16.25 9.74455 16.25 8.74999C16.25 7.75543 15.8549 6.80161 15.1516 6.09834C14.4484 5.39508 13.4946 5 12.5 5Z" fill="#E9E9E9"/>
        </svg>
        <svg width="28" height="33" viewBox="0 0 28 33" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g filter="url(#filter0_d_79_290)">
    <path d="M20.25 0H7.75C5.625 0 4 1.625 4 3.75V11.25H14.75L11.875 8.375C11.375 7.875 11.375 7.125 11.875 6.625C12.375 6.125 13.125 6.125 13.625 6.625L18.625 11.625C19.125 12.125 19.125 12.875 18.625 13.375L13.625 18.375C13.125 18.875 12.375 18.875 11.875 18.375C11.375 17.875 11.375 17.125 11.875 16.625L14.75 13.75H4V21.25C4 23.375 5.625 25 7.75 25H20.25C22.375 25 24 23.375 24 21.25V3.75C24 1.625 22.375 0 20.25 0Z" fill="#C54040" fill-opacity="0.79" shape-rendering="crispEdges"/>
  </g>
  <defs>
    <filter id="filter0_d_79_290" x="0" y="0" width="28" height="33" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="4"/>
      <feGaussianBlur stdDeviation="2"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_79_290"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_79_290" result="shape"/>
    </filter>
  </defs>
</svg>
    </div>
  );
};

export default ProfileCard;


