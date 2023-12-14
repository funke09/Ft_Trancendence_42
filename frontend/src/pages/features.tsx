import next from "next";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { UserType } from "@/redux/profile";
import store, { setProfile } from "@/redux/store";
import api from "@/api";
import { Nav } from "@/components/Layout/NavBar";

const Features: React.FC = () => {
	const [loading, setLoading] = useState(true);
    useEffect(() => {
        api.get("/user/profile")
            .then((res: any) => {
                if (res.status == 200) {
                    store.dispatch(setProfile(res.data));
                    setLoading(false);
                } else {
                    window.location.href = "/";
                }
            })
            .catch((err: any) => {
                window.location.href = "/login";
            });
    }, []);

    if (loading) {
        return <h1>Loading...</h1>;
    }
	
	return (
		<div>
			<Nav/>
			<div className="bg-[#372938] opacity-75 shadow-md m-auto rounded-[15px] flex-col max-w-[1500px] pb-4">
				<div className="flex justify-center">
					<div className="bg-[#C73988] flex-wrap shadow-2xl rounded-b-[20px]">
					<div className="text-white text-center p-4 text-[40px] font-bold">FEATURES</div>
					</div>
				</div>
				<div className="flex flex-col justify-center ">
			<div className=" flex justify-between">
          {/* Left Bars */}
          <div className="flex flex-col items-center">
		  <div className="features-slides">
			<div className="flex items-center ">
				<Image
				src="/images/online.png"
				alt="online"
				width={70}
				height={70}
				className="pr-3"
				></Image>
				<div>
				<h3 className="text-white Manrope text-xl font-semibold">Unleash the thrill of real-time battles</h3>
				<h3 className="text-white text-xl font-semibold">where every move counts</h3>
				</div>
			</div>
			</div>
            <div className="features-slides">
			<div className="flex items-center ">
				<Image
				src="/images/friends.png"
				alt="firends"
				width={70}
				height={70}
				className="pr-3"
				></Image>
				<div>
				<h3 className="text-white text-xl font-semibold">Forge bonds and strategize with your</h3>
				<h3 className="text-white text-xl font-semibold">crew in dedicated chat channels</h3>
				</div>
			</div>
			</div>
			
            <div className="features-slides">
			<div className="flex items-center ">
				<Image
				src="/images/message.png"
				alt="message"
				width={70}
				height={70}
				className="pr-3"
				></Image>
				<div>
				<h3 className="text-white text-xl font-semibold">Connect, banter, and cheer on your</h3>
				<h3 className="text-white text-xl font-semibold">teammates with our chat system.</h3>
				</div>
			</div>
			</div>
          </div>

          {/* Right Bars */}
          <div className="flex flex-col items-center">
            <div className="features-slides">
			<div className="flex items-center ">
				<Image
				src="/images/leaderboard.png"
				alt="leaderboard"
				width={70}
				height={70}
				className="pr-3"
				></Image>
				<div>
				<h3 className="text-white text-xl font-semibold">Rise to the top and let the world know</h3>
				<h3 className="text-white text-xl font-semibold">who dominates the arena!</h3>
				</div>
			</div>
			</div>
            <div className="features-slides">
			<div className="flex items-center ">
				<Image
				src="/images/arcade.png"
				alt="arcade"
				width={70}
				height={70}
				className="pr-3"
				></Image>
				<div>
				<h3 className="text-white text-xl font-semibold">Dive into a world of adventures</h3>
				<h3 className="text-white text-xl font-semibold">that keeps you hooked</h3>
				</div>
			</div>
			</div>
            <div className="features-slides">
			<div className="flex items-center ">
				<Image
				src="/images/medal.png"
				alt="medal"
				width={70}
				height={70}
				className="pr-3"
				></Image>
				<div>
				<h3 className="text-white text-xl font-semibold">Celebrate every victory, big or small! </h3>
				<h3 className="text-white text-xl font-semibold">Achievements for each milestone</h3>
				</div>
			</div>
			</div>
          </div>
        </div>
				</div>
			</div>
		</div>
	);
};

export default Features;