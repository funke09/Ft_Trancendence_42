import { Alert, Button, Card, Input, Spinner } from "@material-tailwind/react";
import { ChangeEvent, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Image from "next/image";
import api from "@/api";
import store, { setProfile } from "@/redux/store";

function refreshPage() {
	setTimeout(() => {
		location.reload();
	}, 1000);
}

function saveUsername(username: string) {
	api.post('/user/setUsername', {username})
		.then((res: any) => {
			if (res.status == 201) {
				toast.success('Successfully changed Username', {
					position: "top-right",
					autoClose: 1000,
					theme: "dark",})
				refreshPage();
			}
		})
		.catch((error: any) => {
			toast.error(error?.response.data.messages[0].toString(), {
				position: "top-right",
				autoClose: 3000,
				theme: "dark",});
		})
}

function saveEmail(email: string) {
	api.post('/user/setEmail', {email})
		.then((res: any) => {
			if (res.status == 201) {
				toast.success('Successfully changed Email', {
					position: "top-right",
					autoClose: 1000,
					theme: "dark",})
				refreshPage();
			}
		})
		.catch((error: any) => {
			toast.error(error?.response.data.messages[0].toString(), {
				position: "top-right",
				autoClose: 3000,
				theme: "dark",
			});
		})
}

function savePassword(password: string) {
	api.post('/user/setPassword', {password})
		.then((res: any) => {
			if (res.status == 201) {
				toast.success('Successfully changed Password', {
					position: "top-right",
					autoClose: 1000,
					theme: "dark",})
				refreshPage();
			}
		})
		.catch((error) => {
			toast.error(error?.response.data.messages[0].toString(), {
				position: "top-right",
				autoClose: 3000,
				theme: "dark",});
		})
}

function EditProfile({ user } : {user: any}) {
	const [username, setUsername] = useState(user.username);
	const [email, setEmail] = useState(user.email);
	const [password, setPassword] = useState("*********");
	const [avatar, setAvatar] = useState<any>(user.avatar);
	const [file, setFile] = useState<File | null>(null);
 
	const changeUsername = ({ target } : {target: any}) => setUsername(target.value);
	const changeEmail = ({ target } : {target: any}) => setEmail(target.value);
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

	function saveAvatar() {
        if (!file) return;
		const formData = new FormData();
		formData.append('file', file as File);

		api.post('/user/saveAvatar', formData)
			.then((res: any) => {
				if (res.status == 201){
					toast.success("Successfully changed Avatar", {theme: 'dark'});
					refreshPage();
				}
			})
			.catch((error: any) => {
				toast.error(error?.response?.data?.messages?.toString(), {theme: 'dark'});
			})
	}

	return (
		<div className="flex-col items-center justify-center p-6 focus:outline">
			<Image className="gap-2 flex m-auto justify-center rounded-full shadow-md mb-4" alt="a" width={200} height={200} src={avatar}/>
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
								value={email}
								type="email"
								variant="standard"
								color="white"
								label="Email"
								onChange={changeEmail}
								crossOrigin={undefined}
								containerProps={{className: "min-w-0",}}
								className='text-white'
							/>
							<Button
								size="sm"
								onClick={() => saveEmail(email)}
								color={email !== user.email ? "green" : "blue-gray"}
								disabled={!email || email == user.email}
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
			<ToastContainer/>
		</div>
	);
}

export default EditProfile;