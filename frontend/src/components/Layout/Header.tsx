import store from "@/redux/store";
import Image from "next/image";
import router from "next/router";
import React from "react";

const Header: React.FC = () => {

	const isAuth: boolean = store.getState().profile.user.email ? true : false;
	return (
	  <div className="bg-[#372938] opacity-75 shadow-md m-auto rounded-[15px] flex max-w-[1500px] pb-4">
		<div className="flex-col justify-center inline-flex items-center">
		  <div className="bg-[#A4357580] shadow-md rounded-[15px] p-6 m-8">
			<h1 className="text-white text-3xl font-bold Manrope tracking-wider mb-4 text-center">
			  Classic Pong
			<hr className="border-1 border-[#5CD0D7] shadow-xl opacity-60 m-4 rounded-full" />
			</h1>
			<div className="text-align text-white text-3xl font-semibold Manrope tracking-wider mb-4">
			  Enjoy the timeless thrill of <br />
			  bouncing balls and <br />
			  competitive fun. <br />
			</div>
		  </div>
		  {isAuth ? <button className=" nav-button hover bg-[#F53FA1] bg-opacity-[75%] rounded-full m-4 w-fit p-4 text-white text-[2rem] font-bold Manrope text-opacity-[100%] hover:bg-opacity-100">
			GET STARTED</button> : <button onClick={() => router.push('/login')} className="bg-[#F53FA1] bg-opacity-[75%] rounded-full m-4 w-fit p-4 text-white text-[2rem] font-bold Manrope text-opacity-[100%] hover:bg-opacity-100">
			GET STARTED</button>
			}
		</div>
  
		<div className="m-4 flex flex-grow justify-end min-[0px]:hidden sm:hidden md:flex">
		  <Image
			src="/images/gameboy.svg"
			alt="gameboy Image"
			width={500}
			height={500}
		  ></Image>
		</div>
	  </div>
	);
  };

export default Header;