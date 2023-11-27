import PongGame from "../components/Game/PongGame";
import Navbar from "@/components/Layout/NavBar";
import Header from "@/components/Layout/Header";
import Image from "next/image";
import Link from "next/link";
import React from "react";


function Home() {
  return (
	<div>
		<Navbar/>
		<div>
			<Header/>
		</div>
	</div>
  );
}
  export default Home;
  