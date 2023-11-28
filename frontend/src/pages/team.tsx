import React from "react";
import Navbar from "@/components/Layout/NavBar";

const Team: React.FC = () => {
    const teamMembers = [
        { id: 1, name: "Funke09", githubUsername: "funke09", role: "Developer" },
        { id: 2, name: "haytham10", githubUsername: "haytham10", role: "Developer" },
        { id: 3, name: "0xPacman", githubUsername: "0xPacman", role: "Developer" },
        { id: 4, name: "YOPll", githubUsername: "YOPll", role: "Developer" },
    ];

    return (
        <div className=" text-white">
            <Navbar />
            <div className="text-center my-8">
                <h1 className="text-3xl">Our Team</h1>
                <ul className="mt-4">
                    {teamMembers.map((member) => (
                        <li key={member.id} className="text-lg my-2">
                            <strong>
                                <a
                                    href={`https://github.com/${member.githubUsername}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline"
                                >
                                    {member.name}
                                </a>
                            </strong>{" "}
                            - {member.role}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Team;
