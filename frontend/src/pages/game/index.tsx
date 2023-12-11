import React from "react";
import Image from "next/image";
import Navbar from "@/components/Layout/NavBar";
import { useRouter } from "next/router";

const Game: React.FC = () => {
	const router = useRouter();
	const { gameID } = router.query;

	return (
		<div>
			<Navbar/>
			<div className="bg-[#372938] opacity-75 shadow-md m-auto rounded-[15px] flex max-w-[1500px] p-3">
				<div className="flex-col m-auto items-center w-full">
					<div className="flex flex-row m-auto p-5 gap-6 place-content-between">
						<div className="flex flex-row gap-4">
							{/* score + players avatar + players names + players level + hor small line in middle*/}
							<Image src={"/"} alt="p1" width={60} height={60} className="rounded-full h-[60px] w-[60px] bg-white flex justify-center items-center shadow-md"></Image>
							<div className="flex-col text-left">
								<p className="font-semibold Manrope text-[24px] text-white">Player 1</p>
								<p className="font-bold Manrope text-[18px] text-[#B8B6B6] text-opacity-[54%]">LEVEL</p>
							</div>
						</div>
						<div className="flex flex-row gap-3 justify-around items-center">
							<a className="rounded-full bg-white w-[30px] h-[30px]"></a>
							<a className="rounded-full bg-white w-[30px] h-[30px]"></a>
							<a className="rounded-full bg-white w-[30px] h-[30px]"></a>
						</div>
						<div className="flex items-center w-[8%]">
							<hr className="border-[#C93A8A] border-solid border-2 w-full rounded-full"></hr>
						</div>
						<div className="flex flex-row gap-3 justify-around items-center">
							<a className="rounded-full bg-white w-[30px] h-[30px]"></a>
							<a className="rounded-full bg-white w-[30px] h-[30px]"></a>
							<a className="rounded-full bg-white w-[30px] h-[30px]"></a>
						</div>
						<div className="flex flex-row gap-4">
							{/* score + players avatar + players names + players level + hor small line in middle*/}
							<div className="flex-col text-right">
								<p className="font-semibold Manrope text-[24px] text-white">Player 2</p>
								<p className="font-bold Manrope text-[18px] text-[#B8B6B6] text-opacity-[54%]">LEVEL</p>
							</div>
							<Image src={"/"} alt="p2" width={60} height={60} className="rounded-full h-[60px] w-[60px] bg-white flex justify-center items-center shadow-md"></Image>
						</div>
					</div>
					<div className="bg-[#48354A] rounded-[15px] m-5">
						{/* <GameLogic gameID={gameID} /> */}
					</div>
				</div>
			</div>
		</div>
	)
};

export default Game;