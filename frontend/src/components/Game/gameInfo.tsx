import React, { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/api";
import store from "@/redux/store";
import { toast } from "react-toastify";
import { AxiosResponse } from "axios";
import Loading from "../Layout/Loading";

export function GameInfo({ children, oppInfo } : { children?: React.ReactNode; oppInfo: { roomName: string; player: number; oppName: string, oppId: number }}) {
	const [info, setInfo] = useState(true);
	const [oppAvatar, setOppAvatar] = useState<string>("");
	const user = store.getState().profile.user;
	

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
		  fetchOpponentAvatar(oppInfo);
		}
	  }, [oppInfo?.oppId]);
	
	const fetchOpponentAvatar = async (oppp: any) => {
		try {
		  const response = await api.get(`/user/${oppp.oppName}`);
		  const opponentAvatar = response.data.avatar || '';
		  setOppAvatar(opponentAvatar);
		} catch (error) {
		  console.error('Error fetching opponent avatar', error);
		}
	};

	return (
		<div className="bg-[#372938] opacity-75 shadow-md m-auto rounded-[15px] flex-row max-w-[1200px] p-3">
		      {info && (
				<div className="flex flex-row m-auto p-5 gap-6 justify-between">
					<div className="flex flex-row items-center gap-4">
						<img
						src={oppInfo?.player === 2 ? oppAvatar : user.avatar}
						alt="p1"
						width={60}
						height={60}
						className="rounded-full h-[60px] w-[60px] bg-white flex justify-center items-center shadow-md"
						/>
						<p className="font-semibold Manrope text-[24px] text-white">{oppInfo?.player === 2 ? oppInfo?.oppName : "You"}</p>
					</div>

					<div className="absolute top-[21%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
						<hr className="border-[#dadada] flex justify-center border-solid border-2 w-11 rounded-full"></hr>
					</div>

					<div className="flex flex-row items-center gap-4">
						<p className="font-semibold Manrope text-[24px] text-white">{oppInfo?.player === 1 ? oppInfo?.oppName : "You"}</p>
						<img
						src={oppInfo?.player === 1 ? oppAvatar : user.avatar}
						alt="p2"
						width={60}
						height={60}
						className="rounded-full h-[60px] w-[60px] bg-white flex justify-center items-center shadow-md"
						/>
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