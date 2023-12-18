import React, { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/api";
import store from "@/redux/store";

export function GameInfo({ children, oppInfo } : { children?: React.ReactNode; oppInfo: { roomName: string; player: number; oppName: string, oppId: number }}) {
	const [info, setInfo] = useState(true); // Initially set to true for screens wider than 720px
	const [oppAvatar, setOppAvatar] = useState<string>('');


	const userAvatar: string = store.getState().profile.user.avatar;
	

	useEffect(() => {
	  const handleResize = () => {
		setInfo(window.innerWidth >= 720);
	  };
  
	  window.addEventListener("resize", handleResize);
  
	  return () => {
		window.removeEventListener("resize", handleResize);
	  };
	}, []);

	useEffect(() => {
		if (oppInfo?.oppId) {
		  // Fetch opponent's avatar when oppId changes
		  fetchOpponentAvatar(oppInfo.oppId);
		}
	  }, [oppInfo?.oppId]);
	
	  const fetchOpponentAvatar = async (oppId: number) => {
		try {
		  const response = await api.get(`/user/${oppInfo.oppName}`);
		  const opponentAvatar = response.data.avatar || '';
		  setOppAvatar(opponentAvatar);
		} catch (error) {
		  console.error('Error fetching opponent avatar', error);
		  // Handle error if needed
		}
	  };

	return (
		<div className="bg-[#372938] opacity-75 shadow-md m-auto rounded-[15px] flex-row max-w-[1200px] p-3">
		      {info && (
				<div className="flex flex-row m-auto p-5 gap-6 justify-between">
					<div className="flex flex-row gap-4">
						<Image
						src={oppInfo?.player === 2 ? oppAvatar : userAvatar}
						alt="p1"
						width={60}
						height={60}
						className="rounded-full h-[60px] w-[60px] bg-white flex justify-center items-center shadow-md"
						></Image>
						<div className="flex-col text-left" style={{ width: '150px' }}>
						<p className="font-semibold Manrope text-[24px] text-white">{oppInfo?.player === 2 ? oppInfo?.oppName : "You"}</p>
						<p className="font-bold Manrope text-[18px] text-[#B8B6B6] text-opacity-[54%]">LEVEL</p>
						</div>
					</div>

					<div className="flex items-center">
						<hr className="border-[#C93A8A] border-solid border-2 w-11 rounded-full"></hr>
					</div>

					<div className="flex flex-row gap-4">
						<div className="flex-col text-right" style={{ width: '150px' }}>
						<p className="font-semibold Manrope text-[24px] text-white">{oppInfo?.player === 1 ? oppInfo?.oppName : "You"}</p>
						<p className="font-bold Manrope text-[18px] text-[#B8B6B6] text-opacity-[54%]">LEVEL</p>
						</div>
						<Image
						src={oppInfo?.player === 1 ? oppAvatar : userAvatar}
						alt="p2"
						width={60}
						height={60}
						className="rounded-full h-[60px] w-[60px] bg-white flex justify-center items-center shadow-md"
						></Image>
					</div>
				</div>
			)}
			{children && (
                <>
					<div className="m-auto items-center">
                		{children}
					</div>
                </>
            )}
		</div>
	);
}