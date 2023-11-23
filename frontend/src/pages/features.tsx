import next from "next";
import Link from "next/link";
import React from "react";
import Navbar from "@/components/Layout/NavBar";

const Features: React.FC = () => {
	return (
		<div>
			<Navbar/>
			<div className="header p-4 md:p-8 flex">
				<div className="flex flex-col justify-center mx-auto my-20 m-12">
					<div className="features-bar">
					<div className="text-white text-center pt-2 text-[40px] font-semibold font-Manrope">FEATURES</div>
					</div>
					<div className="features-container flex justify-between m-8">
          {/* Left Bars */}
          <div className="flex flex-col items-center">
            <div className="features-slides">
				<div></div>
			</div>
            <div className="features-slides" />
            <div className="features-slides" />
          </div>

          {/* Right Bars */}
          <div className="flex flex-col items-center">
            <div className="features-slides" />
            <div className="features-slides" />
            <div className="features-slides" />
          </div>
        </div>
				</div>
			</div>
		</div>
	);
};

export default Features;