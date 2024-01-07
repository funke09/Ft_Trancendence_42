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
            <div className="features-container w-max[1024px]">
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