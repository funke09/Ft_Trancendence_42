import Image from "next/image";
import React from "react";

const Navbar: React.FC = () => {
  return (
    <div className="w-full h-[480px] bg-zinc-800 bg-opacity-75 rounded-2xl shadow flex flex-row my-12">
      <div className="text-center mx-14 my-20">
        <h1 className="text-white text-2xl font-bold Manrope tracking-wider m-2 rounded-s">
          Classic Pong Game
        </h1>
        <div>
          <div className="text-center text-white text-2xl font-medium Manrope tracking-wider my-9">
            Dive into the classic excitement
            <br />
            of Pong with PongMania! <br />
            Enjoy the timeless thrill of bouncing <br />
            balls and competitive fun. <br />
            Ready to play?
          </div>
        </div>
        <button className="pink-button">Get Started</button>
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
