import Image from "next/image";
import React from "react";

const Navbar: React.FC = () => {
	return (
	  <div className="header p-4 md:p-8 flex">
		<div className="flex flex-col justify-center mx-auto my-20 m-12">
		  <div className="text-container">
			<h1 className="text-white text-4xl font-bold Manrope tracking-wider mb-4 text-center">
			  Classic Pong
			<hr className="border-1 border-white opacity-50 m-4" />
			</h1>
			<div className="text-align text-white text-3xl font-semibold Manrope tracking-wider mb-4">
			  Enjoy the timeless thrill of <br />
			  bouncing balls and <br />
			  competitive fun. <br />
			</div>
		  </div>
		  <button className="pink-button mt-5 ">Get Started</button>
		</div>
  
		<div className="m-4 flex flex-grow justify-end">
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
  





export default Navbar;