import store from "@/redux/store";
import Image from "next/image";
import React from "react";
import { useRouter } from 'next/router';
import { Button, Dialog } from "@material-tailwind/react";
import { PlayModal } from "../Game/playMenu";

const Header: React.FC = () => {
	const router = useRouter();
	const [open, setOpen] = React.useState(false);
 
	const handleOpen = () => setOpen(!open);

	const isAuth: boolean = store.getState().profile.user.email ? true : false;
	return (
	  <div className="hom-page  bg-[#372938] opacity-75 shadow-md m-auto rounded-[15px] flex max-w-[1200px] pb-4">
		<div className="flex-col justify-center inline-flex items-center">
		  <div className="bg-[#A4357580] shadow-md rounded-[15px] p-6 m-8">
			<h1 className="text-[#5CD0D7] text-3xl font-bold tracking-wider mb-4 text-center">
				Pong Online: Classic game with Friends
			<hr className="border-1 border-[#5CD0D7] shadow-xl opacity-60 m-4 rounded-full" />
			</h1>
			<div style={{
				color: '#ffffff',
				textAlign: 'center',
				fontSize: '1em',
				fontWeight: 'bold',
				letterSpacing: 'wide',
				marginBottom: '1rem',
				fontFamily: 'Press Start 2P'
				}}>
				Challenge friends in this fast-paced, <br/>
				Fun game, and perfect for quick online matches!
			</div>
		  </div>
			<Button 
			className="hidden opacity-70 lg:inline-block transition ease-in-out delay-150 hover:scale-110 hover:shadow-md hover:opacity-100 text-[1.2rem] duration-300"
			onClick={handleOpen}
			variant="gradient"
			size="lg"
			color="pink"
			>
			PLAY
			</Button>
			{open &&
				<Dialog className="bg-[#382A39] rounded-[30px]" open={open} handler={handleOpen}>
					<PlayModal/>
				</Dialog>
				}
		</div>
  
		<div className="m-4 flex flex-grow justify-end min-[0px]:hidden sm:hidden lg:flex">
		  <img
			src="/images/gameboy.svg"
			alt="gameboy Image"
			width={500}
			height={500}
			priority={true}
		  ></Image>
		</div>
	  </div>
	);
  };

export default Header;