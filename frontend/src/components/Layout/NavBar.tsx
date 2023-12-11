import Image from "next/image";
import Link from "next/link";
import React from "react";
import store from "@/redux/store";
import { useRouter } from "next/router";
import { loader } from "@/utils/loader";

export const getServerSideProps = async () => {
	const data = await loader();
  
	return {
	  props: {
		user: data.user || null,
		token: data.token || null,
	  },
	};
  };

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
  
  const NavBarLogged = () => {
	 const router = useRouter();
	  return (
		<div className="flex items-center place-content-evenly gap-4">
		  <Link href="/" className="nav-button hover:bg-primary1 p-2 rounded-xl min-[0px]:hidden md:flex">
			HOME
		  </Link>
		  <Link href="/chat" className="nav-button hover:bg-primary1 p-2 rounded-xl min-[0px]:hidden md:flex">
			CHAT 
		  </Link>
		  <Link href="/leaderboard" className="nav-button hover:bg-primary1 p-2 rounded-xl shadow-sm min-[0px]:hidden md:flex">
			LEADERBOARD
		  </Link>
		  <button>
			<Image
			  src={store.getState().profile.user.avatar} // Assuming the avatar URL is available in user.image
			  alt="avatar"
			  width={60}
			  height={60}
			  className="ml-2 rounded-full h-[60px] w-[60px] bg-white flex justify-center items-center shadow-md"
			/>
		  </button>
		</div>
	  );
};
  
const Navbar: React.FC = () => {
	const isAuth: boolean = true;
  
	return (
	  <div className="flex shadow-xl bg-[#3B2A3DBF] opacity-75 justify-between p-6 m-auto mt-6 mb-6 rounded-[15px] max-w-[1500px]">
		<div className="items-center place-content-start inline-flex">
		  <Link href="/">
			<Image
			  src="/images/logo.svg"
			  alt="Logo"
			  width={180}
			  height={30}
			/>
		  </Link>
		</div>
		{isAuth ? <NavBarLogged /> : <NavBarNotLogged />}
	  </div>
	);
  };
  

  
export default Navbar;