import React, { useState } from "react";
import {
  Navbar,
  MobileNav,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";
import {
	CubeTransparentIcon,
	UserCircleIcon,
	CodeBracketSquareIcon,
	Square3Stack3DIcon,
	ChevronDownIcon,
	Cog6ToothIcon,
	InboxArrowDownIcon,
	LifebuoyIcon,
	PowerIcon,
	RocketLaunchIcon,
	Bars2Icon,
  } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import store from "@/redux/store";
 

const profileMenuItems = [
  {
    label: "My Profile",
    icon: UserCircleIcon,
  },
  {
    label: "Edit Profile",
    icon: Cog6ToothIcon,
  },
  {
    label: "Inbox",
    icon: InboxArrowDownIcon,
  },
  {
    label: "Help",
    icon: LifebuoyIcon,
  },
  {
    label: "Sign Out",
    icon: PowerIcon,
  },
];
 
function ProfileMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
 
  const closeMenu = () => setIsMenuOpen(false);
 
  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          color="blue-gray"
          className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"
        >
          <Avatar
            variant="circular"
            size="md"
            alt="tania andrew"
            className="border border-gray-900 p-0.5"
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
          />
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3 w-3 transition-transform ${
              isMenuOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </MenuHandler>
      <MenuList className="p-1">
        {profileMenuItems.map(({ label, icon }, key) => {
          const isLastItem = key === profileMenuItems.length - 1;
          return (
            <MenuItem
              key={label}
              onClick={closeMenu}
              className={`flex items-center gap-2 rounded ${
                isLastItem
                  ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                  : ""
              }`}
            >
              {React.createElement(icon, {
                className: `h-4 w-4 ${isLastItem ? "text-red-500" : ""}`,
                strokeWidth: 2,
              })}
              <Typography
                as="span"
                variant="small"
                className="font-normal"
                color={isLastItem ? "red" : "inherit"}
              >
                {label}
              </Typography>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
}

export function Nav() {
  const [openNav, setOpenNav] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);
 
  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false),
    );
  }, []);
 
  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="flex items-center opacity-70 rounded-md gap-x-2 p-1 font-medium transition ease-in-out delay-150 hover:scale-110 hover:shadow-md hover:opacity-100 duration-300 "
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19.4003 18C19.7837 17.2499 20 16.4002 20 15.5C20 12.4624 17.5376 10 14.5 10C11.4624 10 9 12.4624 9 15.5C9 18.5376 11.4624 21 14.5 21L21 21C21 21 20 20 19.4143 18.0292M18.85 12C18.9484 11.5153 19 11.0137 19 10.5C19 6.35786 15.6421 3 11.5 3C7.35786 3 4 6.35786 4 10.5C4 11.3766 4.15039 12.2181 4.42676 13C5.50098 16.0117 3 18 3 18H9.5"
            fill="none"
			stroke="#90A4AE"
			stroke-width="2"
			stroke-linejoin="round"
          />
        </svg>
 
        <Link href="/chat" className="flex items-center">
          Chat
        </Link>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="flex items-center opacity-70 rounded-md gap-x-2 p-1 font-medium transition ease-in-out delay-150 hover:scale-110 hover:shadow-md hover:opacity-100 duration-300 "
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="#90A4AE"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22,7H16.333V4a1,1,0,0,0-1-1H8.667a1,1,0,0,0-1,1v7H2a1,1,0,0,0-1,1v8a1,1,0,0,0,1,1H22a1,1,0,0,0,1-1V8A1,1,0,0,0,22,7ZM7.667,19H3V13H7.667Zm6.666,0H9.667V5h4.666ZM21,19H16.333V9H21Z"
          />
        </svg>
        <Link href="/leaderboard" className="flex items-center">
          Leaderboard
        </Link>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
		className="flex items-center opacity-70 rounded-md gap-x-2 p-1 font-medium transition ease-in-out delay-150 hover:scale-110 hover:shadow-md hover:opacity-100 duration-300 "
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.43361 9.90622C5.34288 10.3793 4.29751 10.6158 4.04881 11.4156C3.8001 12.2153 4.51276 13.0487 5.93808 14.7154L6.30683 15.1466C6.71186 15.6203 6.91438 15.8571 7.00548 16.1501C7.09659 16.443 7.06597 16.759 7.00474 17.3909L6.94899 17.9662C6.7335 20.19 6.62575 21.3019 7.27688 21.7962C7.928 22.2905 8.90677 21.8398 10.8643 20.9385L11.3708 20.7053C11.927 20.4492 12.2052 20.3211 12.5 20.3211C12.7948 20.3211 13.073 20.4492 13.6292 20.7053L14.1357 20.9385C16.0932 21.8398 17.072 22.2905 17.7231 21.7962C18.3742 21.3019 18.2665 20.19 18.051 17.9662M19.0619 14.7154C20.4872 13.0487 21.1999 12.2153 20.9512 11.4156C20.7025 10.6158 19.6571 10.3793 17.5664 9.90622L17.0255 9.78384C16.4314 9.64942 16.1343 9.5822 15.8958 9.40114C15.6573 9.22007 15.5043 8.94564 15.1984 8.3968L14.9198 7.89712C13.8432 5.96571 13.3048 5 12.5 5C11.6952 5 11.1568 5.96571 10.0802 7.89712"
            stroke="#90A4AE"
			stroke-width="1.5"
			stroke-linecap="round"
          />
		  <path
		  	d="M4.98987 2C4.98987 2 5.2778 3.45771 5.90909 4.08475C6.54037 4.71179 8 4.98987 8 4.98987C8 4.98987 6.54229 5.2778 5.91525 5.90909C5.28821 6.54037 5.01013 8 5.01013 8C5.01013 8 4.7222 6.54229 4.09091 5.91525C3.45963 5.28821 2 5.01013 2 5.01013C2 5.01013 3.45771 4.7222 4.08475 4.09091C4.71179 3.45963 4.98987 2 4.98987 2Z"
		  	stroke="#90A4AE"
			stroke-linejoin="round"
		  />
		  <path
		  	d="M18 5H20M19 6L19 4"
			stroke="#90A4AE"
			stroke-width="1"
			stroke-linecap="round"
		  />
        </svg>
        <Link href="/features" className="flex items-center">
			Features
        </Link>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="flex items-center opacity-70 rounded-md gap-x-2 p-1 font-medium transition ease-in-out delay-150 hover:scale-110 hover:shadow-md hover:opacity-100 duration-300 "
		>
        <Image
			src="/images/team.png"
			alt="team"
			width={24}
			height={24}
			/>
        <Link href="/team" className="flex items-center">
          Our Team
        </Link>
      </Typography>
    </ul>
  );
  
  return (
	  <Navbar className="bg-[#3B2A3DBF] bg-opacity-70 m-auto mt-6 mb-6 border-0 px-4 py-2 lg:px-8 lg:py-4 max-w-[1500px]">
      <div className="container m-auto justify-between flex items-center text-blue-gray-900">
        <Typography
          className="mr-4 cursor-pointer py-1.5 font-medium" href="/">
			<Image
				width={170}
				height={50}
				alt="logo"
				src={"images/logo.svg"}
				></Image>
        </Typography>
        <div className="hidden lg:block justify-center">{navList}</div>
        <div className="flex items-center justify-end gap-x-1">
          <Button
            variant="gradient"
            size="sm"
            className="hidden lg:inline-block"
			>
            <span>Sign in</span>
          </Button>
        </div>
        <IconButton
          variant="text"
          className="ml-auto h-7 w-7 flex text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
          ripple={false}
          onClick={() => setOpenNav(!openNav)}
		  >
          {openNav ? (
			  <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
			  >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
				/>
            </svg>
          ) : (
			  <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
			  >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
				/>
            </svg>
          )}
        </IconButton>
		<div className="profileMenu justify-end">
			<Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
				<MenuHandler>
					<Button
						variant="text"
						color="gray"
						className=" gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"	
					>
						<Avatar
							alt="avatar"
							className="border max-w-[60px] max-h-[60px] border-[#F53FA1] p-0.5"
							src={store.getState().profile.user.avatar}
						/>
						<ChevronDownIcon
							strokeWidth={2.5}
							className={`h-3 w-3 transition-transform ${
							isMenuOpen ? "rotate-180" : ""
							}`}
						/>
					</Button>
				</MenuHandler>
				<MenuList className="p-1">
        	{profileMenuItems.map(({ label, icon }, key) => {
          		const isLastItem = key === profileMenuItems.length - 1;
				return (
					<MenuItem
					key={label}
					onClick={closeMenu}
					className={`flex items-center gap-2 rounded ${
						isLastItem
						? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
						: ""
					}`}
            >
              {React.createElement(icon, {
                className: `h-4 w-4 ${isLastItem ? "text-red-500" : ""}`,
                strokeWidth: 2,
              })}
              <Typography
                as="span"
                variant="small"
                className="font-normal"
                color={isLastItem ? "red" : "inherit"}
              >
                {label}
              </Typography>
            </MenuItem>
          );
        })}
      </MenuList>
			</Menu>
		</div>
      </div>
      <MobileNav open={openNav}>
        <div className="container m-auto">
          {navList}
          <div className="flex place-self-end items-center gap-x-1">
            <Button fullWidth variant="gradient" size="sm" className="">
              <span>Sign in</span>
            </Button>
		  </div>
        </div>
      </MobileNav>
    </Navbar>
  );
}