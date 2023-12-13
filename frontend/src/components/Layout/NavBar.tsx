import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import store, { setProfile } from "@/redux/store";
import ProfileCard from "@/components/ProfileCard";
import { useRouter } from "next/router";
import { UserType } from "@/redux/profile";
import api from "@/api";

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
  
  const NavBarLogged = ({ setShowCard }) => {
	 const router = useRouter();
	 const user: UserType = store.getState().profile.user;
	  return (
		
		<>
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
		  {/* <button>
			<Image
			  src={store.getState().profile.user.avatar} // Assuming the avatar URL is available in user.image
			  alt="avatar"
			  width={60}
			  height={60}
			  className="ml-2 rounded-full h-[60px] w-[60px] bg-white flex justify-center items-center shadow-md"
			/>
		  </button> */}
		  <button
        onClick={() => setShowCard(true)}
        className="relative"
      >
        <Image
          src={store.getState().profile.user.avatar}
          alt="avatar"
          width={60}
          height={60}
          className="ml-2 rounded-full h-[60px] w-[60px] bg-white flex justify-center items-center shadow-md"
        />
      </button>
		</div>
		</>
	  );
		
};
  
const Navbar: React.FC = () => {
	const isAuth: boolean = store.getState().profile.user.email ? true : false;
	const user = store.getState().profile.user
	const [showCard, setShowCard] = useState(false);

	return (
			<>
			  {showCard && <ProfileCard user={user} fn={setShowCard} />}
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
					{isAuth ? <NavBarLogged setShowCard={setShowCard} /> : <NavBarNotLogged />}
				</div>
			  </>
	);
  };
  

  
export default Navbar;