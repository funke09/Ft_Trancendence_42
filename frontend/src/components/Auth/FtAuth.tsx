import React from "react";

interface auth {
	intra: Function;
}

export type { auth };

export function FtAuth({ auth } : { auth: auth}) {
	return (
		<button
		className="bg-black"
		onClick={() => {
			auth.intra();
		}}
		>INTRA</button>
	);
}