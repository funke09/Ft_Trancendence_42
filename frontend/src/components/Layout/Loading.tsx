import Image from "next/image";
import React from "react"

const Loading: React.FC = () => {
	return (
		<main className='flex flex-col m-auto justify-center items-center h-screen z-1'>
		<Image
			src='/images/loading.gif'
			alt='loading'
			width={80}
			height={80}
			className='shadow-md pb-4'
		/>
		<p className='font-bold text-[25px] text-gray-300 animate-bounce transition-all'>Loading...</p>
	</main>
	)
};

export default Loading;