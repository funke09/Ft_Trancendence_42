import Image from "next/image";
import Link from "next/link";
import React from "react";
import { usePathname } from 'next/navigation'
import { useRouter } from "next/router";
import { useAuth } from "../Auth/AuthProvider";


const NavBarNotLogged = () => {
	const router = useRouter();

	const handlePlayNowClick = () => {
		router.push('/login');
	  };

	return (
	  <div className="flex items-center place-content-evenly gap-5 min-[0px]:hidden sm:hidden md:flex">
		<Link href="/" className="nav-button hover:bg-primary1 p-2 rounded-xl">
		  HOME
		</Link>
		<Link href="/team" className="nav-button hover:bg-primary1 p-2 rounded-xl">
		  OUR TEAM 
		</Link>
		<Link href="/features" className="nav-button hover:bg-primary1 p-2 rounded-xl shadow-sm">
		  FEATURES
		</Link>
		<button onClick={handlePlayNowClick} className="pink-button">PLAY NOW!</button>
	  </div>
	);
  };
  
  const NavBarLogged = () => {
	// Placeholder for the logged-in state
	return (
	  <div className="flex items-center place-content-evenly gap-4 min-[0px]:hidden sm:hidden md:flex">
		<Link href="/" className="nav-button hover:bg-primary1 p-2 rounded-xl">
		  HOME
		</Link>
		<Link href="/chat" className="nav-button hover:bg-primary1 p-2 rounded-xl">
		  CHAT 
		</Link>
		<Link href="/leaderboard" className="nav-button hover:bg-primary1 p-2 rounded-xl shadow-sm">
		  LEADERBOARD
		</Link>
		<button className="pink-button">PLAY NOW!</button>
		<button className="bg-white shadow-2xl p-2 rounded-full w-[60px] h-[60px]">
		{/* <Image
		></Image> */}
		</button>
	  </div>
	);
  };
  
  const Navbar: React.FC = () => {
	const { isAuthenticated, signInWith42, signOut } = useAuth();
	return (
	  <div className="flex shadow-xl bg-[#3B2A3DBF] opacity-75 justify-between p-6 m-auto mt-6 mb-6 rounded-[15px] max-w-[1080px]">
		<div className="lgDiv items-center place-content-start inline-flex">
		  <Link href="/">
			<Image
			  src="/images/logo.svg"
			  alt="Logo"
			  width={160}
			  height={30}
			  className="mr-4"
			/>
		  </Link>
		</div>
		{isAuthenticated ? <NavBarLogged /> : <NavBarNotLogged />}
	  </div>
	);
  };
  

  
export default Navbar;