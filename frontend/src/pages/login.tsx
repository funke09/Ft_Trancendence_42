import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import SigninForm from '../components/Auth/SigninForm';
import SignUpForm from '@/components/Auth/SignUpForm';
import api from '@/api';
import Loading from '@/components/Layout/Loading';
import store, { setProfile } from '@/redux/store';
import { Button } from '@material-tailwind/react';
import Link from 'next/link';

const Icons: React.FC = () => {
	return (
		<div >
		<span className="absolute right-40 top-40">
		<svg
			width="40"
			height="40"
			viewBox="0 0 40 40"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle
			cx="1.39737"
			cy="38.6026"
			r="1.39737"
			transform="rotate(-90 1.39737 38.6026)"
			fill="#FFFFFF"
			/>
			<circle
			cx="1.39737"
			cy="1.99122"
			r="1.39737"
			transform="rotate(-90 1.39737 1.99122)"
			fill="#FFFFFF"
			/>
			<circle
			cx="13.6943"
			cy="38.6026"
			r="1.39737"
			transform="rotate(-90 13.6943 38.6026)"
			fill="#FFFFFF"
			/>
			<circle
			cx="13.6943"
			cy="1.99122"
			r="1.39737"
			transform="rotate(-90 13.6943 1.99122)"
			fill="#FFFFFF"
			/>
			<circle
			cx="25.9911"
			cy="38.6026"
			r="1.39737"
			transform="rotate(-90 25.9911 38.6026)"
			fill="#FFFFFF"
			/>
			<circle
			cx="25.9911"
			cy="1.99122"
			r="1.39737"
			transform="rotate(-90 25.9911 1.99122)"
			fill="#FFFFFF"
			/>
			<circle
			cx="38.288"
			cy="38.6026"
			r="1.39737"
			transform="rotate(-90 38.288 38.6026)"
			fill="#FFFFFF"
			/>
			<circle
			cx="38.288"
			cy="1.99122"
			r="1.39737"
			transform="rotate(-90 38.288 1.99122)"
			fill="#FFFFFF"
			/>
			<circle
			cx="1.39737"
			cy="26.3057"
			r="1.39737"
			transform="rotate(-90 1.39737 26.3057)"
			fill="#FFFFFF"
			/>
			<circle
			cx="13.6943"
			cy="26.3057"
			r="1.39737"
			transform="rotate(-90 13.6943 26.3057)"
			fill="#FFFFFF"
			/>
			<circle
			cx="25.9911"
			cy="26.3057"
			r="1.39737"
			transform="rotate(-90 25.9911 26.3057)"
			fill="#FFFFFF"
			/>
			<circle
			cx="38.288"
			cy="26.3057"
			r="1.39737"
			transform="rotate(-90 38.288 26.3057)"
			fill="#FFFFFF"
			/>
			<circle
			cx="1.39737"
			cy="14.0086"
			r="1.39737"
			transform="rotate(-90 1.39737 14.0086)"
			fill="#FFFFFF"
			/>
			<circle
			cx="13.6943"
			cy="14.0086"
			r="1.39737"
			transform="rotate(-90 13.6943 14.0086)"
			fill="#FFFFFF"
			/>
			<circle
			cx="25.9911"
			cy="14.0086"
			r="1.39737"
			transform="rotate(-90 25.9911 14.0086)"
			fill="#FFFFFF"
			/>
			<circle
			cx="38.288"
			cy="14.0086"
			r="1.39737"
			transform="rotate(-90 38.288 14.0086)"
			fill="#FFFFFF"
			/>
		</svg>
		</span>
		<span className="absolute bottom-40 left-40">
		<svg
			width="29"
			height="40"
			viewBox="0 0 29 40"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle
			cx="2.288"
			cy="25.9912"
			r="1.39737"
			transform="rotate(-90 2.288 25.9912)"
			fill="#FFFFFF"
			/>
			<circle
			cx="14.5849"
			cy="25.9911"
			r="1.39737"
			transform="rotate(-90 14.5849 25.9911)"
			fill="#FFFFFF"
			/>
			<circle
			cx="26.7216"
			cy="25.9911"
			r="1.39737"
			transform="rotate(-90 26.7216 25.9911)"
			fill="#FFFFFF"
			/>
			<circle
			cx="2.288"
			cy="13.6944"
			r="1.39737"
			transform="rotate(-90 2.288 13.6944)"
			fill="#FFFFFF"
			/>
			<circle
			cx="14.5849"
			cy="13.6943"
			r="1.39737"
			transform="rotate(-90 14.5849 13.6943)"
			fill="#FFFFFF"
			/>
			<circle
			cx="26.7216"
			cy="13.6943"
			r="1.39737"
			transform="rotate(-90 26.7216 13.6943)"
			fill="#FFFFFF"
			/>
			<circle
			cx="2.288"
			cy="38.0087"
			r="1.39737"
			transform="rotate(-90 2.288 38.0087)"
			fill="#FFFFFF"
			/>
			<circle
			cx="2.288"
			cy="1.39739"
			r="1.39737"
			transform="rotate(-90 2.288 1.39739)"
			fill="#FFFFFF"
			/>
			<circle
			cx="14.5849"
			cy="38.0089"
			r="1.39737"
			transform="rotate(-90 14.5849 38.0089)"
			fill="#FFFFFF"
			/>
			<circle
			cx="26.7216"
			cy="38.0089"
			r="1.39737"
			transform="rotate(-90 26.7216 38.0089)"
			fill="#FFFFFF"
			/>
			<circle
			cx="14.5849"
			cy="1.39761"
			r="1.39737"
			transform="rotate(-90 14.5849 1.39761)"
			fill="#FFFFFF"
			/>
			<circle
			cx="26.7216"
			cy="1.39761"
			r="1.39737"
			transform="rotate(-90 26.7216 1.39761)"
			fill="#FFFFFF"
			/>
		</svg>
		</span>
	</div>
	)
}

const Auth: React.FC = () => {
	const [activeTab, setActiveTab] = useState<'login' | 'signup'>('signup');
	const [loading, setLoading] = useState(true);
	const [side, setSide] = useState(true);

	const switchToLogin = () => setActiveTab('login');
	const switchToSignUp = () => setActiveTab('signup');

	useEffect(() => {
		const handleResize = () => {
		  setSide(window.innerWidth >= 720);
		};
		window.addEventListener("resize", handleResize);
		return () => {
		  window.removeEventListener("resize", handleResize);
		};
	}, []);

	useEffect(() => {
		api.get('/user/profile')
		  .then((res: any) => {
			if (res.status === 200) {
			  window.location.href = '/profile';
			  setLoading(false);
			}
		  })
		  .catch((err: any) => {
			setLoading(false);
		  });
	  }, []);
	
	if (loading) return <Loading />;

	return (
		<main className="flex w-full h-screen m-auto">
			{side &&
				<section className="w-1/4 relative min-[0px] flex bg-[#382A39] bg-opacity-75">
					<div className="absolute flex-grow top-4 left-4 opacity-95">
						<Image src="/images/egypt.png" alt="pyramid" width={200} height={200}></Image>
					</div>
					<div className="flex-grow flex items-center justify-center">
						<Image src="/images/controller.png" alt="controller" width={500} height={500}></Image>
					</div>
					<div className="absolute bottom-4 right-4 opacity-75">
						<Image src="/images/no9at.png" alt="no9at" width={200} height={100}></Image>
					</div>
				</section>
			}
			<section className="sm:w-full md:w-3/4 bg-[#1C252E] relative">
				<div className="flex flex-col h-full bg-gradient-to-t from-[#f53fa056] to-[#382A39]">
					<div className="flex flex-row justify-around relative my-8">
						<Button
							color={activeTab === 'signup' ? "pink" : "gray"}
							className={`nav-button w-[7rem] h-[3rem] rounded-3xl hover:bg-primary1  ${
							activeTab === 'signup'
							? 'shadow-md font-semibold text-white text-[0.2rem]'
							: 'shadow-md font-semibold text-[#342938] text-[0.2rem] transition-all'
							} ease-in`}
							onClick={switchToSignUp}
						>
						SIGN UP
						</Button>
						<Button
							color={activeTab === 'login' ? "pink" : "gray"}
							className={`nav-button w-[7rem] h-[3rem] rounded-3xl hover:bg-primary1  ${
							activeTab === 'login'
							? 'shadow-md font-semibold text-white text-[1rem]'
							: 'shadow-md font-semibold text-[#342938] text-[1rem] transition-all'
							}  ease-in`}
							onClick={switchToLogin}
						>
						LOGIN
						</Button>
					</div>
					<div className="flex justify-center p-10 text-[75px] font-bold text-white ">
						<h1>{activeTab === 'login' ? 'Welcome Back' : 'Get Started'}</h1>
					</div>
					<div className='flex justify-center p-6 relative'>
						{activeTab === 'login' ? <SigninForm /> : <SignUpForm />}
					</div>
					<p className="mb-2 flex justify-center text-base font-bold text-white">OR</p>
					<ul className="m-2 flex justify-center">
						<li className="px-2">
						<Link href={`http://localhost:5000/auth/42`}
							className="nav-button hover flex h-11 px-11 items-center text-semibold text-white text-[18px] justify-center gap-4 rounded-full bg-[#1B1B1B] hover:bg-opacity-90"
						>
							<img
							src="images/42_Logo.png"
							alt="42"
							className="inline-block max-w-[60px] max-h-[30px] shadow-md">
							</img>
							Login with Intra</Link>
						</li>
					</ul>
					{side && <Icons/>}
				</div>
      		</section>
		</main>
	);
};

export default Auth;