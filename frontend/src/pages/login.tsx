import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import SigninForm from '../components/Auth/SigninForm';
import SignUpForm from '@/components/Auth/SignUpForm';
import api from '@/api';
import Loading from '@/components/Layout/Loading';
import store, { setProfile } from '@/redux/store';

const Auth: React.FC = () => {
	const [activeTab, setActiveTab] = useState<'login' | 'signup'>('signup');
	const [loading, setLoading] = useState(true);

	const switchToLogin = () => setActiveTab('login');
	const switchToSignUp = () => setActiveTab('signup');

	useEffect(() => {
		api.get('/user/profile')
		  .then((res: any) => {
			if (res.status === 200) {
			  window.location.href = '/';
			  setLoading(false);
			}
		  })
		  .catch((err: any) => {
			setLoading(false);
		  });
	  }, []);
	
	if (loading) return <Loading />;

	return (
		<main className="flex flex-col h-screen md:flex-row">
      		<section className="w-1/4 relative min-[0px] hidden sm:hidden md:flex bg-[#382A39] bg-opacity-75">
				<div className="absolute flex-grow top-4 left-4 m-10 opacity-95">
					<Image src="/images/egypt.png" alt="pyramid" width={200} height={200}></Image>
				</div>
				<div className="flex-grow flex items-center justify-center">
					<Image src="/images/controller.png" alt="controller" width={500} height={500}></Image>
				</div>
				<div className="absolute bottom-4 right-4 m-5 opacity-75">
					<Image src="/images/no9at.png" alt="no9at" width={200} height={100}></Image>
				</div>
			</section>
			<section className="w-3/4 bg-[#1C252E] relative">
				<div className="flex flex-col bg-gradient-to-t from-[#f53fa056] to-[#382A39]">
					<div className="flex flex-row justify-around relative my-8">
						<button
							className={`nav-button w-[7rem] h-[3rem] rounded-3xl hover:bg-primary1  ${
							activeTab === 'signup'
							? 'bg-[#B1216E] bg-opacity-[69%] shadow-md font-semibold text-white text-[1rem]'
							: 'bg-white bg-opacity-75 shadow-md font-semibold text-[#342938] text-[1rem] transition-all'
							} ease-in`}
							onClick={switchToSignUp}
						>
						SIGN UP
						</button>
						<button
							className={`nav-button w-[7rem] h-[3rem] rounded-3xl hover:bg-primary1 ${
							activeTab === 'login'
							? 'bg-[#B1216E] bg-opacity-[69%] shadow-md font-semibold text-white text-[1rem]'
							: 'bg-white bg-opacity-75 shadow-md font-semibold text-[#342938] text-[1rem] transition-all'
							}`}
							onClick={switchToLogin}
						>
						LOGIN
						</button>
					</div>
				<div className="flex justify-center p-10 text-[75px] font-bold text-white ">
					<h1>{activeTab === 'login' ? 'Welcome Back' : 'Get Started'}</h1>
				</div>
				{activeTab === 'login' ? <SigninForm /> : <SignUpForm />}
				</div>
      		</section>
		</main>
	);
};

export default Auth;