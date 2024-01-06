import React, { useEffect, useState } from "react";
import store, { setProfile } from "@/redux/store";
import api from "@/api";
import { Nav } from "@/components/Layout/NavBar";

const Team: React.FC = () => {
    const teamMembers = [
        { id: 1, name: "Funke09", githubUsername: "funke09", role: "Software Engineer" },
        { id: 2, name: "haytham10", githubUsername: "haytham10", role: "Full-Stack Engineer" },
        { id: 3, name: "Oussamazz", githubUsername: "Oussamazz", role: "DevOps enthusiast" },
        { id: 4, name: "0xPacman", githubUsername: "0xPacman", role: "Infra & Cloud Specialist" },
        { id: 5, name: "YOPll", githubUsername: "YOPll", role: "Infra & System Specialist" },
    ];

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

    const images = [
        "https://avatars.githubusercontent.com/u/92769858?v=4",
        "https://avatars.githubusercontent.com/u/31369367?v=4",
        "https://avatars.githubusercontent.com/u/40428234?v=4",
        "https://avatars.githubusercontent.com/u/22503811?v=4",
        "https://avatars.githubusercontent.com/u/49567393?v=4",
    ];


    return (
        <div className="text-white">
            <Nav/>
            <div className="text-center my-8">
                <h1 className="text-3xl team-h  p-3 ">Our Team
                <hr className="border-1 border-[#5CD0D7] shadow-xl opacity-60 p-2 m-4 max-width[1200px] rounded-full" />
                </h1>     
                <div className="flex flex-wrap justify-center mt-4">
                    {teamMembers.map((member) => (
                        <div key={member.id} className="card m-4">
                            <div className="card-image">
                                { <img src={images[member.id - 1]} alt={member.name} /> }
                            </div>
                            <div className="card-content">
                                <a
                                    href={`https://github.com/${member.githubUsername}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="github-link"
                                >
                                    
                                    <i className="fab fa-github"></i>
                                    <br />
                                    <span className="text-pink-600">{member.name}</span>
                                    <br />
                                    
                                    <span>{member.role}</span>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Team;
