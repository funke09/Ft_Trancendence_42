import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navbar: React.FC = () => {
	return (
	  <div className="navBar p-4 md:p-8 flex items-center justify-between">
		<Link href="/">
		  <Image
			src="/images/logo.svg"
			alt="Logo"
			width={160}
			height={30}
			className="mr-4"
		  />
		</Link>
		<div className="flex items-center space-x-6">
		  <Link href="/" className="nav-button">
			HOME
		  </Link>
		  <Link href="/team" className="nav-button">
			OUR TEAM 
		  </Link>
		  <Link href="/features" className="nav-button">
			FEATURES
		  </Link>
		  <button className="pink-button">PLAY NOW!</button>
		</div>
	  </div>
	);
  };
  
  
export default Navbar;