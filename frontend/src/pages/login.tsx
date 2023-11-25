import next from "next";
import Link from "next/link";
import React from "react";
import Image from "next/image";

const Login: React.FC = () => {
	return (
	  <div className="flex flex-row h-screen">
		<div className="flex flex-col bg-[#382A39] w-1/2 relative min-[0px]:hidden sm:hidden md:flex">
		  <div className="absolute flex-grow top-4 left-4 m-10 opacity-95 shadow-sm">
			<Image src="/images/egypt.png" alt="Top Left" width={200} height={200} className="rounded-full" />
		  </div>
		  <div className="flex-grow flex items-center justify-center shadow-sm">
			<Image src="/images/controller.png" alt="Main" width={500} height={500} />
		  </div>
		  <div className="absolute bottom-4 right-4 m-5 shadow-sm opacity-75">
			<Image src="/images/no9at.png" alt="Bottom Right" width={210} height={100} className="rounded-full" />
		  </div>
		</div>
	
		<div className="flex flex-col bg-gradient-to-t from-[#382A39] items-center justify-center w-1/2 sm:w-screen md:w-1/2">
		  <button className="bg-[#4CAF9E] absolute items-center flex justify-center rounded-full w-[100px] h-[100px] opacity-75 hover:opacity-100">
			<Image src="/images/school_42.png" alt="42 logo" width={100} height={100}></Image>
		  </button>
		  <p className="text-white text-2xl font-bold Manrope tracking-wider text-center mt-[150px]">SIGN IN</p>
		</div>
	  </div>
	);
	
	  
};

export default Login;
