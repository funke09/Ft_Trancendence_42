import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import store, { setProfile } from "@/redux/store";
import { useRouter } from "next/router";
import api from "@/api";
import { UserType } from "@/redux/profile";

const NavBarNotLogged = () => {
	return (
	  <div className="flex items-center place-content-evenly gap-5 min-[0px]:hidden sm:hidden md:flex">
		<Link href="/" className="nav-button hover:bg-primary1 p-2 rounded-xl min-[0px]:hidden md:flex">
		  HOME
		</Link>
		<Link href="/team" className="nav-button hover:bg-primary1 p-2 rounded-xl min-[0px]:hidden md:flex">
		  OUR TEAM 
		</Link>
		<Link href="/features" className="nav-button hover:bg-primary1 p-2 rounded-xl shadow-sm min-[0px]:hidden md:flex">
		  FEATURES
		</Link>
		<Link href={"/login"}>
			<button className="pink-button">PLAY NOW!</button>
		</Link>
	  </div>
	);
  };
  
  const NavBarLogged = ( user: UserType) => {
	  return (
		<div className="flex items-center place-content-evenly gap-4">
		  <Link href="/" className="nav-button hover:bg-primary1 p-2 rounded-xl min-[0px]:hidden md:flex">
			HOME
		  </Link>
		  <Link href="/chat" className="nav-button hover:bg-primary1 p-2 rounded-xl min-[0px]:hidden md:flex">
			CHAT 
		  </Link>
		  <Link href="/leaderboard" className="nav-button hover:bg-primary1 p-2 rounded-xl min-[0px]:hidden md:flex">
			LEADERBOARD
		  </Link>
		  <Link href={'/'} className="min-[0px]:hidden md:flex">
			<button className="pink-button">PLAY</button>
		  </Link>
		  <button>
			<Image
			  src={user.avatar}
			  alt="avatar"
			  width={60}
			  height={60}
			  className="ml-2 rounded-full h-[60px] w-[60px] flex justify-center items-center shadow-md min-[0px]:hidden md:flex"
			/>
		  </button>
		</div>
	  );
};
  
const Navbar: React.FC = () => {
	const user: UserType = store.getState().profile.user;
	const isAuth: boolean = user ? true : false;

	return (
	  <div className="flex shadow-xl bg-[#3B2A3DBF] opacity-75 justify-between p-6 m-auto mt-6 mb-6 rounded-[15px] max-w-[1500px]">
		<div className="items-center place-content-start inline-flex">
		  <Link href="/">
			<Image
			  src="/images/logo.svg"
			  alt="Logo"
			  width={200}
			  height={100}
			/>
		  </Link>
		</div>
		{isAuth ? <NavBarLogged {...user}/> : <NavBarNotLogged />}
	  </div>
	);
  };
  

  
export default Navbar;