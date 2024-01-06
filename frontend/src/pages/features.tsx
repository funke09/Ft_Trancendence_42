// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import store, { setProfile } from "@/redux/store";
// import api from "@/api";
// import { Nav } from "@/components/Layout/NavBar";
// import Loading from "@/components/Layout/Loading";

// const Features: React.FC = () => {
// 	const [loading, setLoading] = useState(true);
//     useEffect(() => {
//         api.get("/user/profile")
//             .then((res: any) => {
//                 if (res.status == 200) {
//                     store.dispatch(setProfile(res.data));
//                     setLoading(false);
//                 } else {
//                     window.location.href = "/";
//                 }
//             })
//             .catch((err: any) => {
//                 window.location.href = "/login";
//             });
//     }, []);

//     if (loading) {
//         return <Loading/>;
//     }
	
// 	return (
// 		<div>
// 			<Nav/>
// 			<div className="bg-[#372938] opacity-75 shadow-md m-auto rounded-[15px] flex-col max-w-[1200px] pb-4">
// 				<div className="flex justify-center">
// 					<div className="bg-[#C73988] flex-wrap shadow-2xl rounded-b-[20px]">
// 					<div className="text-white text-center p-4 text-[40px] font-bold">FEATURES</div>
// 					</div>
// 				</div>
// 				<div className="flex flex-col justify-center ">
// 			<div className=" flex justify-between">
//           {/* Left Bars */}
//           <div className="flex flex-col items-center">
// 		  <div className="features-slides">
// 			<div className="flex items-center ">
// 				<Image
// 				src="/images/online.png"
// 				alt="online"
// 				width={70}
// 				height={70}
// 				className="pr-3"
// 				></Image>
// 				<div>
// 				<h3 className="text-white Manrope text-xl font-semibold">Unleash the thrill of real-time battles</h3>
// 				<h3 className="text-white text-xl font-semibold">where every move counts</h3>
// 				</div>
// 			</div>
// 			</div>
//             <div className="features-slides">
// 			<div className="flex items-center ">
// 				<Image
// 				src="/images/friends.png"
// 				alt="firends"
// 				width={70}
// 				height={70}
// 				className="pr-3"
// 				></Image>
// 				<div>
// 				<h3 className="text-white text-xl font-semibold">Forge bonds and strategize with your</h3>
// 				<h3 className="text-white text-xl font-semibold">crew in dedicated chat channels</h3>
// 				</div>
// 			</div>
// 			</div>
			
//             <div className="features-slides">
// 			<div className="flex items-center ">
// 				<Image
// 				src="/images/message.png"
// 				alt="message"
// 				width={70}
// 				height={70}
// 				className="pr-3"
// 				></Image>
// 				<div>
// 				<h3 className="text-white text-xl font-semibold">Connect, banter, and cheer on your</h3>
// 				<h3 className="text-white text-xl font-semibold">teammates with our chat system.</h3>
// 				</div>
// 			</div>
// 			</div>
//           </div>

//           {/* Right Bars */}
//           <div className="flex flex-col items-center">
//             <div className="features-slides">
// 			<div className="flex items-center ">
// 				<Image
// 				src="/images/leaderboard.png"
// 				alt="leaderboard"
// 				width={70}
// 				height={70}
// 				className="pr-3"
// 				></Image>
// 				<div>
// 				<h3 className="text-white text-xl font-semibold">Rise to the top and let the world know</h3>
// 				<h3 className="text-white text-xl font-semibold">who dominates the arena!</h3>
// 				</div>
// 			</div>
// 			</div>
//             <div className="features-slides">
// 			<div className="flex items-center ">
// 				<Image
// 				src="/images/arcade.png"
// 				alt="arcade"
// 				width={70}
// 				height={70}
// 				className="pr-3"
// 				></Image>
// 				<div>
// 				<h3 className="text-white text-xl font-semibold">Dive into a world of adventures</h3>
// 				<h3 className="text-white text-xl font-semibold">that keeps you hooked</h3>
// 				</div>
// 			</div>
// 			</div>
//             <div className="features-slides">
// 			<div className="flex items-center ">
// 				<Image
// 				src="/images/medal.png"
// 				alt="medal"
// 				width={70}
// 				height={70}
// 				className="pr-3"
// 				></Image>
// 				<div>
// 				<h3 className="text-white text-xl font-semibold">Celebrate every victory, big or small! </h3>
// 				<h3 className="text-white text-xl font-semibold">Achievements for each milestone</h3>
// 				</div>
// 			</div>
// 			</div>
//           </div>
//         </div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// export default Features;

import React, { useEffect, useState } from "react";
import Image from "next/image";
import store, { setProfile } from "@/redux/store";
import api from "@/api";
import { Nav } from "@/components/Layout/NavBar";
import Loading from "@/components/Layout/Loading";

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
        return <Loading />;
    }
	// should be in one line and same size
    return (
        <div>
            <Nav />
            <div className="features-container">
                <div className="features-header">
                    <h1>FEATURES</h1>
                </div>
                <div className="features-grid">
                    {featureData.map((feature, index) => (
                        <div key={index} className="feature-card">
                            <Image
                                src={feature.image}
                                alt={feature.alt}
                                width={70}
                                height={70}
                            />
                            <div className="feature-text">
                                <p>{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Features;

const featureData = [
    {
		
        image: "/images/online.svg",
        alt: "online",
        description: "Join players from around the globe in thrilling ping battles. Play anytime, anywhere, and experience diverse styles and challenges."
    },
    {
        image: "/images/friends.svg",
        alt: "friends",
        description: "Make new friends, form teams, and enjoy the social side of gaming. Connect, strategize, and share the fun with fellow players."
    },
    {
        image: "/images/chat.svg",
        alt: "message",
        description: "Communicate seamlessly with friends and teammates. Share strategies, tips, or casual conversations in our user-friendly chat channels."
    },
    {
        image: "/images/win.svg",
        alt: "leaderboard",
        description: "Compete to rise to the top of the leaderboard. Showcase your skills, outmaneuver opponents, and gain recognition among the best."
    },
    {
        image: "/images/play.svg",
        alt: "arcade",
        description: "Jump into varied game modes for non-stop entertainment. Whether for easy mode or hard mode, Fun Zone is all about enjoyment."
    },
    {
        image: "/images/celebration.svg",
        alt: "medal",
        description: "Collect achievements for every gaming feat. Celebrate your progress and showcase your success in a rewarding way."
    }
];