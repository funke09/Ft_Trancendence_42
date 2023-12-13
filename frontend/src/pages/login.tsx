import React, { useState } from 'react';
import Image from 'next/image';
import SigninForm from '../components/Auth/SigninForm';
import SignUpForm from '@/components/Auth/SignUpForm';

const Auth: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('signup');

  const switchToLogin = () => setActiveTab('login');
  const switchToSignUp = () => setActiveTab('signup');

  // GitHub usernames
  const githubUsernames = ['funke09', 'haytham10', '0xPacman', 'YOPll'];

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
          <div className="flex justify-center p-10 text-[4.6rem] font-bold text-white ">
            <h1>{activeTab === 'login' ? 'Welcome Back' : 'Get Started'}</h1>
          </div>
          <div className='bg-[#372938] m-7 flex justify-center rounded-[15px] p-1 text-center text-[0.9rem] font-bold text-white'>
            <p className="text-[0.9rem]  text-white font-blod">
              Welcome to the thrilling world of PING PONG! <br />
              Embark on an epic journey filled with challenges and excitement. <br />
              To unlock the full potential of your gaming experience, log in now and dive into a realm where every move matters. <br />
              Your profile awaits with exclusive features and interactions. <br/>
              Get started today and join the adventure!
            </p>
          </div>
          {activeTab === 'login' ? <SigninForm /> : <SignUpForm />}
          <div className="bg-[#372938] opacity-75 shadow-md m-4 rounded-[15px] flex-col max-w-[1500px] pb-4">
            <div className="flex justify-center">
              <div className="bg-[#C73988] flex-wrap shadow-2xl rounded-b-[20px]">
                <div className="text-white text-center p-4 text-[1rem] font-bold">FEATURES</div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-center gap-8 p-8">
              <div className="text-white Manrope text-[0.8rem] font-semibold mb-4">
                <Image
                  src="/images/medal.png"
                  alt="medal"
                  width={55}
                  height={20}
                  className="pr-3"
                ></Image>
                <div className='p-2'>
                  <h3 className="text-white text-[0.8rem] font-semibold">- Celebrate every victory, big or small! </h3>
                  <h3 className="text-white text-[0.8rem] font-semibold">- Achievements for each milestone</h3>
                </div>
              </div>
              <div className="text-white text-[0.8rem] font-semibold">
                <Image
                  src="/images/arcade.png"
                  alt="arcade"
                  width={55}
                  height={20}
                  className="pr-3"
                ></Image> 
                <div className="p-2">
                  <h3 className="text-white text-[0.8rem] font-semibold">- Dive into a world of adventures</h3>
                  <h3 className="text-white text-[0.8rem] font-semibold">- that keeps you hooked</h3>
                </div>
              </div>
              <div className="text-white Manrope text-[0.8rem] font-semibold mb-4">
                <Image
                  src="/images/leaderboard.png"
                  alt="leaderboard"
                  width={55}
                  height={20}
                  className="pr-3"
                ></Image>
                <div className="p-2">
                  <h3 className="text-white text-[0.8rem]  font-semibold">- Rise to the top and let the world know</h3>
                  <h3 className="text-white text-[0.8rem] font-semibold">- who dominates the arena!</h3>
                </div>
              </div>
              <div className="text-white text-[0.8rem] font-semibold">
                <Image
                  src="/images/message.png"
                  alt="message"
                  width={55}
                  height={20}
                  className="pr-3"
                ></Image>
                <div className='p-2'>
                  <h3 className="text-white text-[0.8rem] font-semibold">- Connect, banter, and cheer on your</h3>
                  <h3 className="text-white text-[0.8rem] font-semibold">- teammates with our chat system.</h3>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#372938] opacity-75 m-20 shadow-md rounded-[15px] flex-col max-w-[1500px] ">
            <div className="flex justify-center">
              <div className="bg-[#C73988] flex-wrap shadow-2xl rounded-b-[20px]">
                <div className="text-white text-center p-4 text-[1rem] font-bold">OUR PROFILES</div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-center gap-8 p-8">
              {githubUsernames.map((username, index) => (
                <div key={index} className="text-white Manrope text-[0.8rem] font-semibold mb-4">
                  <a
                    href={`https://github.com/${username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {username}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Auth;
