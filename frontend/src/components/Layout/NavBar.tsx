import React, { useEffect, useState } from "react";
import {
  Navbar,
  Collapse,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Badge,
  Dialog,
  Popover,
  PopoverContent,
  PopoverHandler,
  List,
  ListItem,
  ListItemPrefix,
  DialogHeader,
} from "@material-tailwind/react";
import Image from "next/image";
import Link from "next/link";
import store, { removeFriend, setProfile } from "@/redux/store";
import { UserType } from "@/redux/profile";
import { PlayModal } from "../Game/playMenu";
import api from "@/api";
import { toast } from "react-toastify";
import chatSocket from "@/sockets/chatSocket";
import { AddFriend } from "../User/types";
import { SocketRes } from "@/sockets/types";
import { useSelector } from "react-redux";
 

export function Nav() {
  const [openNav, setOpenNav] = useState(false);

  const [open, setOpen] = React.useState(false);
 
  const handleOpen = () => setOpen(!open);

  const user: UserType = useSelector((state: any) => state.profile.user);

  function clickLogout() {
	api.post('/auth/logout')
		.then((res: any) => {
			if (res.status == 201)
				window.location.href = '/login';
		})
  }
 
  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false),
    );
  }, []);
  
function NotificationsMenu() {
    const [notifs, setNotifs] = useState<any[]>([]);
	const [newNotifCount, setNewNotifCount] = useState<number>(0);
	const [openNotif, setOpenNotif] = useState(false);

	useEffect(() => {
		store.subscribe(() => {
			setNotifs(store.getState().notif.friendRequest ?? []);
		});
		chatSocket.on("notification", () => {
			setNewNotifCount((prev) => prev + 1);
		});
	}, []);
	
	const acceptFriend = (id: number, notifID: number) => {
		let payload: AddFriend = {id: id};
		chatSocket.emit('acceptFriend', payload);
		
		chatSocket.on('acceptFriend', (data: SocketRes | any) => {
			if (data == null) return;
			if (data && data?.status == 200) {
				store.dispatch(removeFriend(notifID));
				chatSocket.emit("reconnect");
			} else {
				if (data?.status)
					toast.error(data.message, {theme: "dark"});
			}
		});
	};

	const rejectFriend = (username: string, id: number) => {
		api.post('/user/rejectFriend', {
			friendUsername: username,
		})
			.then((res: any) => {
				toast.info(res.data.message ?? `You decliend ${username}'s friend request`, {theme: "dark"});
			})
			.catch((err: any) => {
				toast.error(err?.response?.data.message ?? "An Error Occured!", {theme: "dark"});
			})
		store.dispatch(removeFriend(id));
	};

	const triggers = {
		onMouseEnter: () => {
			setOpenNotif(true);
			setNewNotifCount(0);
		},
		onMouseLeave: () => setOpenNotif(false),
	}
  
	return (
		<Popover
		animate={{
			mount: { scale: 1, y: 0 },
			unmount: { scale: 0, y: -25 },
		}}
		handler={setOpenNotif}
		open={openNotif}
		offset={3}
		>
			<Badge invisible={newNotifCount == 0} content={newNotifCount}>
				<PopoverHandler {...triggers}>
					<IconButton onClick={() => (setOpenNotif(true), setNewNotifCount(0))} variant="text" className="border-none outline-none">
						<i className="fa-regular fa-bell text-2xl" style={{ color: '#E1E1E1' }}></i>
					</IconButton>
				</PopoverHandler>
			</Badge>
			<PopoverContent {...triggers} className="notif flex flex-col p-0 gap-2 bg-[#382A39] max-h-[200px] overflow-y-auto min-w-[300px] z-50 border-none shadow-md !text-white">
				<List>
				{notifs.length === 0 && (
					<div className="flex items-center justify-center">
						<Typography className="p-6 m-auto text-gray-500" variant="h6">No Notifications</Typography>
					</div>
				)}
				{notifs.map((notif) => (
					<ListItem key={notif.id} className="hover:bg-opacity-100 focus:bg-transparent focus:outline-none hover:bg-transparent active:bg-transparent">
						<ListItemPrefix>
						<img src={notif.avatar} width={45} height={45} alt="avatar" className="rounded-full" />
						</ListItemPrefix>
						<div>
						<Typography variant="small" color="white">
							{notif.msg}
						</Typography>
						</div>
						{notif.type === 'friendRequest' && (
							<div className="flex flex-row items-center justify-center gap-2 ml-3">
								<IconButton size="sm" className="bg-[#1cce3a] hover:scale-105" onClick={() => acceptFriend(notif.friendId, notif.id)}>
									<i className="fa-solid fa-check"></i>
								</IconButton>
								<IconButton size="sm" className="bg-[#ce1c1c] hover:scale-105" onClick={() => rejectFriend(notif.from, notif.id)}>
									<i className="fa-solid fa-xmark"></i>
								</IconButton>
							</div>
						)}
					</ListItem>
				))}
				</List>
			</PopoverContent>
   		</Popover>
	);
}
  

const ProfileMenu = (
		<Menu>
			<MenuHandler>
				<Avatar
				alt="avatar"
				className="cursor-pointer h-10 w-10 opacity-80 hover:opacity-100"
				src={user.avatar}
				/>
			</MenuHandler>
			<MenuList className="bg-[#382A39] border-none hidden samwil:flex focus:outline-none rounded-[15px]" >
				<div className="min-w-[240px] min-h-[257px] p-4 focus:outline-none flex-col justify-center">
					<div className=" gap-2 flex justify-center">
						<img
							src={user.avatar}
							alt="avatar"
							width={70}
							height={70}
							className="rounded-full flex"
						/>
					</div>
					<Typography className="flex justify-center p-1 font-bold text-[18px] text-opacity-90 text-[#EAEAEA]">{user.username}</Typography>
					<Typography className="flex justify-center p-1 pb-3 font-medium text-[14px] text-opacity-75 text-[#EAEAEA]">{user.email}</Typography>
					<hr typeof="text" className="border-[#F6F6F6] mx-5 mb-2 flex justify-center rounded-full border-opacity-75" />
					<Link href={'/profile/' + user.id}>
					<MenuItem className="flex justify-center gap-2">
						<svg
							width="25"
							height="25"
							viewBox="0 0 25 25"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M12.5 2.5C10.751 2.49968 9.03241 2.95811 7.5159 3.82953C5.99939 4.70096 4.73797 5.95489 3.85753 7.46619C2.97709 8.97748 2.50844 10.6933 2.49834 12.4423C2.48825 14.1913 2.93707 15.9124 3.80001 17.4337C4.38327 16.6757 5.13305 16.062 5.99136 15.64C6.84968 15.218 7.79355 14.999 8.75 15H16.25C17.2064 14.999 18.1503 15.218 19.0086 15.64C19.867 16.062 20.6167 16.6757 21.2 17.4337C22.0629 15.9124 22.5117 14.1913 22.5017 12.4423C22.4916 10.6933 22.0229 8.97748 21.1425 7.46619C20.262 5.95489 19.0006 4.70096 17.4841 3.82953C15.9676 2.95811 14.249 2.49968 12.5 2.5ZM22.4287 20.095C24.1 17.9162 25.004 15.2459 25 12.5C25 5.59625 19.4037 0 12.5 0C5.59626 0 1.40665e-05 5.59625 1.40665e-05 12.5C-0.00411273 15.246 0.899895 17.9162 2.57126 20.095L2.56501 20.1175L3.00876 20.6337C4.18112 22.0044 5.63674 23.1045 7.2753 23.8583C8.91385 24.6121 10.6964 25.0016 12.5 25C15.0342 25.0046 17.5092 24.2349 19.5937 22.7937C20.4824 22.1797 21.2882 21.4538 21.9912 20.6337L22.435 20.1175L22.4287 20.095ZM12.5 5C11.5054 5 10.5516 5.39508 9.84835 6.09834C9.14509 6.80161 8.75 7.75543 8.75 8.74999C8.75 9.74455 9.14509 10.6984 9.84835 11.4016C10.5516 12.1049 11.5054 12.5 12.5 12.5C13.4946 12.5 14.4484 12.1049 15.1516 11.4016C15.8549 10.6984 16.25 9.74455 16.25 8.74999C16.25 7.75543 15.8549 6.80161 15.1516 6.09834C14.4484 5.39508 13.4946 5 12.5 5Z" fill="#E9E9E9"/>
						</svg>
						<Typography variant="small" className="font-bold text-[#E4E4E4]">
							My Profile
						</Typography >
					</MenuItem>
					</Link>
					<MenuItem onClick={clickLogout}
					className="flex justify-center gap-2 ">
					<svg
						width="25"
						height="25"
						viewBox="0 0 25 25"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M16.25 0H3.75C1.625 0 0 1.625 0 3.75V11.25H10.75L7.875 8.375C7.375 7.875 7.375 7.125 7.875 6.625C8.375 6.125 9.125 6.125 9.625 6.625L14.625 11.625C15.125 12.125 15.125 12.875 14.625 13.375L9.625 18.375C9.125 18.875 8.375 18.875 7.875 18.375C7.375 17.875 7.375 17.125 7.875 16.625L10.75 13.75H0V21.25C0 23.375 1.625 25 3.75 25H16.25C18.375 25 20 23.375 20 21.25V3.75C20 1.625 18.375 0 16.25 0Z"
							fill="#C54040"/>
					</svg>
					<Typography variant="small" className="font-bold text-[#E4E4E4]">
						Sign Out
					</Typography>
					</MenuItem>
				</div>
			</MenuList>
		</Menu>
)

const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography
        as="li"
        variant="small"
		color="white"
        className="flex items-center ml-3 opacity-70 rounded-md font-medium transition-all hover:scale-105"
      >
		<Link href="/chat" className="flex items-center gap-x-2 p-1">
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
			strokeWidth="2"
			strokeLinejoin="round"
          />
        </svg>
          Chat
        </Link>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="white"
		className="flex items-center ml-3 opacity-70 rounded-md font-medium transition-all hover:scale-105"
      >
		<Link href="/features" className="flex items-center gap-x-2 p-1">
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
			strokeWidth="1.5"
			strokeLinecap="round"
          />
		  <path
		  	d="M4.98987 2C4.98987 2 5.2778 3.45771 5.90909 4.08475C6.54037 4.71179 8 4.98987 8 4.98987C8 4.98987 6.54229 5.2778 5.91525 5.90909C5.28821 6.54037 5.01013 8 5.01013 8C5.01013 8 4.7222 6.54229 4.09091 5.91525C3.45963 5.28821 2 5.01013 2 5.01013C2 5.01013 3.45771 4.7222 4.08475 4.09091C4.71179 3.45963 4.98987 2 4.98987 2Z"
		  	stroke="#90A4AE"
			strokeLinejoin="round"
		  />
		  <path
		  	d="M18 5H20M19 6L19 4"
			stroke="#90A4AE"
			strokeWidth="1"
			strokeLinecap="round"
		  />
        </svg>
			Features
        </Link>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="white"
        className="flex items-center ml-3 opacity-70 rounded-md font-medium transition-all hover:scale-105"
		>
		<Link href="/team" className="flex items-center gap-x-2 p-1">
        <img
			src="/images/team.png"
			alt="team"
			width={24}
			height={24}
			/>
          Our Team
        </Link>
      </Typography>
	  {openNav &&
		<Typography
        as="li"
        variant="small"
		color="white"
        className="flex items-center ml-3 opacity-70 rounded-md font-medium transition-all hover:scale-105"
      >
		<Link href="/profile" className="flex items-center gap-x-2 p-1">
		<svg
			width="24"
			height="24"
			viewBox="0 0 25 25"
			fill="none"
			xmlns="http://www.w3.org/2000/svg">
			<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M12.5 2.5C10.751 2.49968 9.03241 2.95811 7.5159 3.82953C5.99939 4.70096 4.73797 5.95489 3.85753 7.46619C2.97709 8.97748 2.50844 10.6933 2.49834 12.4423C2.48825 14.1913 2.93707 15.9124 3.80001 17.4337C4.38327 16.6757 5.13305 16.062 5.99136 15.64C6.84968 15.218 7.79355 14.999 8.75 15H16.25C17.2064 14.999 18.1503 15.218 19.0086 15.64C19.867 16.062 20.6167 16.6757 21.2 17.4337C22.0629 15.9124 22.5117 14.1913 22.5017 12.4423C22.4916 10.6933 22.0229 8.97748 21.1425 7.46619C20.262 5.95489 19.0006 4.70096 17.4841 3.82953C15.9676 2.95811 14.249 2.49968 12.5 2.5ZM22.4287 20.095C24.1 17.9162 25.004 15.2459 25 12.5C25 5.59625 19.4037 0 12.5 0C5.59626 0 1.40665e-05 5.59625 1.40665e-05 12.5C-0.00411273 15.246 0.899895 17.9162 2.57126 20.095L2.56501 20.1175L3.00876 20.6337C4.18112 22.0044 5.63674 23.1045 7.2753 23.8583C8.91385 24.6121 10.6964 25.0016 12.5 25C15.0342 25.0046 17.5092 24.2349 19.5937 22.7937C20.4824 22.1797 21.2882 21.4538 21.9912 20.6337L22.435 20.1175L22.4287 20.095ZM12.5 5C11.5054 5 10.5516 5.39508 9.84835 6.09834C9.14509 6.80161 8.75 7.75543 8.75 8.74999C8.75 9.74455 9.14509 10.6984 9.84835 11.4016C10.5516 12.1049 11.5054 12.5 12.5 12.5C13.4946 12.5 14.4484 12.1049 15.1516 11.4016C15.8549 10.6984 16.25 9.74455 16.25 8.74999C16.25 7.75543 15.8549 6.80161 15.1516 6.09834C14.4484 5.39508 13.4946 5 12.5 5Z" fill="#90A4AE"/>
		</svg>
          Profile
        </Link>
      </Typography>
	  }
    </ul>
  );
  
  return (
	  <Navbar className="bg-[#3B2A3DBF] bg-opacity-70 m-auto mt-6 mb-6 border-0 px-4 py-2 lg:px-8 lg:py-4 max-w-[1200px]">
      <div className="relative samwil:mx-auto flex items-center samwil:justify-between text-white">
        <Typography
          className="mr-4 cursor-pointer py-1.5 content-start font-medium">
			<Link href={'/'}>
			<img
				width={170}
				height={50}
				alt="logo"
				src="/images/logo.svg"
				style={{ width: '170px', height: '50px' }}
			/>
			</Link>
        </Typography>
        <div className="hidden lg:block ">{navList}</div>
        <div className="flex items-center w-max gap-x-6">
			<div className="hidden samwil:flex">{NotificationsMenu()}</div>
			<Button
			onClick={handleOpen}
			variant="gradient"
			size="md"
			color="pink"
			className="hidden opacity-70 lg:inline-block transition ease-in-out delay-150 hover:scale-110 hover:shadow-md hover:opacity-100 duration-300"
			>
			PLAY
			</Button>
			{open &&
			<Dialog className="bg-[#382A39] rounded-[30px]" open={open} handler={handleOpen}>
				<PlayModal/>
			</Dialog>
			}
		<div className="hidden samwil:flex">{ProfileMenu}</div>
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
		<div className="flex samwil:hidden">
			{NotificationsMenu()}
		</div>
      </div>
      <Collapse open={openNav}>
        <div className="container m-auto">
          {navList}
          <div className="flex place-self-end justify-around p-2">
		  <Button
			onClick={handleOpen}
            variant="gradient"
            size="md"
			color="pink"
			>
            PLAY
          </Button>
		  <Button onClick={clickLogout} variant="gradient" size="md" color="red">
			Sign Out
		  </Button>
		  </div>
        </div>
      </Collapse>
    </Navbar>
  );
}