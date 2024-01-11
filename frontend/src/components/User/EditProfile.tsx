import { Button, Card, Dialog, DialogBody, Input } from "@material-tailwind/react";
import { ChangeEvent, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Image from "next/image";
import api from "@/api";
import chatSocket from "@/sockets/chatSocket";

function EditProfile({ user, updateProfile, setEdit, setShowEnableTwoFA} : {user : any, updateProfile: (newProfile: any) => void, setEdit: React.Dispatch<React.SetStateAction<boolean>>, setShowEnableTwoFA: any }) {
	const [open] = useState(true);
	const [username, setUsername] = useState(user.username);
	const [password, setPassword] = useState("*********");
	const [avatar, setAvatar] = useState<any>(user.avatar);
	const [file, setFile] = useState<File | null>(null);
	const [is2FA, setIs2FA] = useState(user.isTwoFA);

	const openHandler = () => setEdit(!open);
	
	const clickEnable = () => {
		setEdit(false); // Close the EditProfile modal
		setShowEnableTwoFA(true); // Open the EnableTwoFA modal
	}

	const clickDisable = () => {
		api.post('/user/disableTwoFA', {userId: user.id})
			.then((res: any) => {
				if (res.status == 201) {
					toast.success("2-FA Disabled", {theme: "dark"});
					setEdit(!open);
				}
			})
			.catch((err: any) => {
				toast.error(err?.response?.data?.messages?.toString(), {theme: 'dark'});
			})
	}

	const changeUsername = ({ target } : {target: any}) => setUsername(target.value);
	const changePassword = ({ target } : {target: any}) => setPassword(target.value);

	useEffect(() => {
		if (file) 
		  setAvatar(URL.createObjectURL(file));
		else 
		  setAvatar(user.avatar);
	  }, [file]);
	
	  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files)
		  setFile(e.target.files[0]);
	};

	
	const saveAvatar = async () => {
		if (!file) return;
		const formData = new FormData();
		formData.append('file', file as File);
	
		try {
		  const res = await api.post('/user/saveAvatar', formData);
		  if (res.status == 201){
			toast.success("Avatar changed Successfully", {theme: 'dark'});
			updateProfile({...user, avatar});
			setEdit(false);
		  }
		} catch (error: any) {
		  toast.error(error?.response?.data?.messages?.toString(), {theme: 'dark'});
		}
	}

	function saveUsername(username: string) {
		api.post('/user/setUsername', {username})
			.then((res: any) => {
				if (res.status == 201) {
					toast.success('Username changed Successfully', {
						autoClose: 1000,
						theme: "dark",})
						updateProfile({...user, username});
						setEdit(!open);
					}
			})
			.catch((error: any) => {
				toast.error(error?.response.data.messages[0].toString(), {
					position: "top-right",
					autoClose: 3000,
					theme: "dark",});
			})
	}
	
	function savePassword(password: string) {
		api.post('/user/setPassword', {password})
			.then((res: any) => {
				if (res.status == 201) {
					toast.success('Successfully changed Password', {
						position: "top-right",
						autoClose: 1000,
						theme: "dark",});
					setEdit(!open);
				}
			})
			.catch((error) => {
				toast.error(error?.response.data.messages[0].toString(), {
					position: "top-right",
					autoClose: 3000,
					theme: "dark",});
			})
	}
	
	return (
		<Dialog className="bg-[#382A39] rounded-[30px]" open={open} handler={openHandler}>
			<DialogBody className="flex-col items-center justify-center p-6 focus:outline">
				<img className="gap-2 flex m-auto justify-center rounded-full shadow-md mb-4" alt="a" width={200} height={200} src={avatar}/>
				{file ? <Button variant="gradient" size="sm" color="green" className="flex justify-center m-auto shadow-md" onClick={saveAvatar}>Upload</Button> :
				<Button size="sm" onClick={() => document.getElementById("avatar-input")?.click()} className="flex justify-center m-auto shadow-md">
					<i className="fa-solid fa-camera flex justify-center" />
				</Button>}
				<input
					type="file"
					accept="image/*"
					onChange={handleFileChange}
					className="hidden"
					id="avatar-input"
				/>
				<Card color="transparent" className="flex items-center ml-[40px]" shadow={false}>
					<form className="max-w-screen-lg sm:w-96">
						<div className="flex flex-col p-4 gap-[50px]">
							<div className="relative flex w-full max-w-[20rem]">
								<Input
									size="lg"
									value={username}
									variant="standard"
									color="white"
									label="Username"
									onChange={changeUsername}
									crossOrigin={undefined}
									containerProps={{className: "min-w-0",}}
									className='text-white'
								/>
								<Button
									size="sm"
									onClick={() => saveUsername(username)}
									color={username !== user.username ? "green" : "blue-gray"}
									disabled={!username || username == user.username}
									className="!absolute right-1 top-1 rounded"
								>
								SAVE
								</Button>
							</div>
							<div className="relative flex w-full max-w-[20rem]">
								<Input
									size="lg"
									value={password}
									variant="standard"
									color="white"
									label="Password"
									type="password"
									onChange={changePassword}
									crossOrigin={undefined}
									containerProps={{className: "min-w-0",}}
									className='text-white'
								/>
								<Button
									size="sm"
									onClick={() => savePassword(password)}
									color={password !== "*********" ? "green" : "blue-gray"}
									disabled={!password || password == "*********"}
									className="!absolute right-1 top-1 rounded"
								>
								SAVE
								</Button>
							</div>
						</div>
					</form>
				</Card>
				{!is2FA ?
				<Button onClick={clickEnable} variant="gradient" color="green">Enable 2FA</Button>
				:
				<Button onClick={clickDisable} variant="gradient" color="red">Disable 2FA</Button>}
				<ToastContainer/>
			</DialogBody>
		</Dialog>
	);
}

export default EditProfile;