import Image from "next/image";
import React from "react";

const Navbar: React.FC = () => {
  return (
    <div className="w-full h-[480px] bg-zinc-800 bg-opacity-75 rounded-2xl shadow flex flex-row my-12">
      <div className="flex flex-col justify-center mx-auto my-20 m-12">
        <h1 className="text-white text-2xl font-bold Manrope tracking-wider m-12 rounded-s justify-center" style={{ backgroundColor: '#333', width: '265px', padding: '10px' }}>
          Classic Pong Game
        </h1>
        <div className="text-center text-white text-2xl font-medium Manrope tracking-wider my-9 m-12">
          Dive into the classic excitement
          <br />
          of Pong with PongMania! <br />
          Enjoy the timeless thrill of bouncing <br />
          balls and competitive fun. <br />
          Ready to play?
        </div>
        <button className="pink-button m-12">Get Started</button>
      </div>

      <div className="m-4 flex flex-grow justify-end">
        <Image
          src={"/static/images/items/RetroGameboy.svg"}
          alt="gameboy Image"
          width={797}
          height={448}
        ></Image>
      </div>
    </div>
  );
};





export default Navbar;
