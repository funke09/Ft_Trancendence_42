import React from "react";

interface auth {
	intra: Function;
}

export type { auth };

export function FtAuth({ auth } : { auth: auth}) {
	return (
		<button
		className="text-white text-lg rounded-full bg-bubble-gum"
		onClick={() => {
			auth.intra();
		}}
		>INTRA</button>
	);
}