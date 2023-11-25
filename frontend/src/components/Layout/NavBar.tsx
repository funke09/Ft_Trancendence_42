import Image from "next/image";
import Link from "next/link";
import React from "react";
import { usePathname } from 'next/navigation'

const Navbar: React.FC = () => {
	const pathname = usePathname();

	return (
			<div className="flex shadow-xl bg-[#3B2A3DBF] opacity-75 justify-between p-6 m-8 rounded-[15px] max-w-[1080px]">
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
				<button className="pink-button">PLAY NOW!</button>
				</div>
			</div>
	);
  };

  
export default Navbar;