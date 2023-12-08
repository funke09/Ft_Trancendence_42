import React, { useState } from 'react'
import Image from 'next/image';
import SigninForm from '../components/Auth/SigninForm';
import SignUpForm from '@/components/Auth/SignUpForm';

const Auth: React.FC = () => {

	const [activeTab, setActiveTab] = useState<'login' | 'signup'>('signup');

	const switchToLogin = () => setActiveTab('login');
	const switchToSignUp = () => setActiveTab('signup');
	
	return (
		<main className="flex flex-row h-screen">
			<section className="flex flex-col bg-[#382A39] w-2/5 relative min-[0px]:hidden sm:hidden md:flex bg-opacity-75">
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
			<section className="h-screen w-3/5 bg-[#1C252E] relative bg-opacity-100">
        <div className="flex w-full h-full flex-col bg-gradient-to-t from-[#f53fa056] to-[#382A39]">
          <div className="flex flex-row justify-around relative my-8">
            <button
              className={`w-[150px] h-[50px] rounded-3xl ${
                activeTab === 'signup'
                  ? 'bg-[#B1216E] bg-opacity-[69%] shadow-md font-semibold text-white text-[24px]'
                  : 'bg-white bg-opacity-75 shadow-md font-semibold text-[#342938] text-[24px] transition-all'
              } ease-in`}
              onClick={switchToSignUp}
            >
              SIGN UP
            </button>
            <button
              className={`w-[150px] h-[50px] rounded-3xl ${
                activeTab === 'login'
                  ? 'bg-[#B1216E] bg-opacity-[69%] shadow-md font-semibold text-white text-[24px]'
                  : 'bg-white bg-opacity-75 shadow-md font-semibold text-[#342938] text-[24px] transition-all'
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