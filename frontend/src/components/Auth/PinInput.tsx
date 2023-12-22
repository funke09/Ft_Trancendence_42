import api from '@/api';
import store, { setProfile } from '@/redux/store';
import { Dialog, DialogBody, Typography } from '@material-tailwind/react';
import React, { useEffect, useRef, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import { refreshPage } from '../User/EditProfile';

function PinInput() {
	const [open, setOpen] = useState(true);
	const [pin, setPin] = useState(['', '', '', '', '', '']);
	const inputRefs = useRef<(HTMLInputElement | null)[]>(pin.map(() => null));

	const openHandler = () => setOpen(!open);

	const handlePinChange = (index: number, value: string) => {
		const newPin = [...pin];
		newPin[index] = value;
		setPin(newPin);
	};

	const handleInput = (index: number, event: React.FormEvent<HTMLInputElement>) => {
		const value = event.currentTarget.value;
		if (!/^\d*$/.test(value)) {
			return;
		}
		handlePinChange(index, value);
	
		if (index < pin.length - 1 && value !== '') {
		  // Move focus to the next input field when a digit is entered
		  inputRefs.current[index + 1]?.focus();
		}
	};
	
	const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
		const inputElement = event.currentTarget;
		const caretPosition = inputElement.selectionStart;
	
		if (event.key === 'Backspace' && caretPosition === 0 && index > 0) {
		  // Move focus to the previous input field when Backspace is pressed at the start
		  inputRefs.current[index - 1]?.focus();
		}
	};
	
	useEffect(() => {
		// Focus on the first empty input when pin changes
		const firstEmptyIndex = pin.findIndex((digit) => digit === '');

		if (inputRefs.current[firstEmptyIndex]) {
		inputRefs.current[firstEmptyIndex]?.focus();
		}

		// Check if all digits are filled
		const isPinFilled = pin.every((digit) => digit !== '');
		if (isPinFilled) {
			api.post('/user/verifyTwoFA', {pin: pin.join('')})
				.then((res: any) => {
					if (res.status == 201) {
						window.location.href = '/profile';
					}
				})
				.catch((err: any) => {
					toast.error(err?.response?.data?.messages?.toString(), {theme: 'dark'});
				})
		}
  	}, [pin]);

	return (
		<>
			<Dialog size="xs" className="bg-primary1 rounded-[30px]" open={open} handler={openHandler}>
				<DialogBody className='flex flex-col m-auto items-center justify-center min-h-[300px]'>
				<ToastContainer/>
					<>
						<Typography className="absolute top-8 opacity-75" color="white" variant="h5">
							Enter 6-Digit PIN
						</Typography>
						<div className="py-2 px-3 rounded-lg">
							<div className="flex space-x-3" data-hs-pin-input>
								{pin.map((digit, index) => (
									<input
										key={index}
										ref={(el) => (inputRefs.current[index] = el)}
										className="block w-[40px] h-[40px] text-center font-bold bg-gray-300 rounded-md text-md placeholder:text-gray-800 focus:border-primary1 focus:ring-primary1 disabled:opacity-50 disabled:pointer-events-none caret-transparent"
										type="text"
										placeholder="○"
										value={digit}
										onChange={(e) => handleInput(index, e)}
										onKeyDown={(e) => handleKeyDown(index, e)}
										maxLength={1}
										autoFocus={index === 0}
										onSubmit={openHandler}
									/>
								))}
							</div>
						</div>
					</>
				</DialogBody>
			</Dialog>
		</>
	)
}

export default PinInput