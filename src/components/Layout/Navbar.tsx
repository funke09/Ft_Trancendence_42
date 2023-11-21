import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navbar: React.FC = () => {
  return (
    <div className="w-full h-20 bg-neutral-700 bg-opacity-75 rounded-2xl shadow py-3 px-4 flex items-center">
      <Link href="/">
        <Image
          src="/static/images/logo/logo.svg"
          alt="42 Logo"
          width={100}
          height={136}
        />
      </Link>
      <div className="flex-grow flex items-center justify-end space-x-6">
        <Link href="/" className="nav-button">
          HOME
        </Link>
        <Link href="/team" className="nav-button">
          OUR TEAM
        </Link>
        <Link href="/features" className="nav-button">
        Sing in with 42 intra 
        </Link>
        <button className="pink-button">PLAY NOW!</button>
      </div>
    </div>
  );
};

export default Navbar;
