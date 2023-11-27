import React from 'react';
import { useSession } from "next-auth/react"

// const AvatarUploader: React.FC = () => {
// 	const { data: session } = useSession();
	
// 	if (session && session.user) {
// 		const { user } = session;

//   const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     // Implement avatar upload logic
//   };

//   return (
//     <div>
//       <h2>Avatar Uploader</h2>
//       {user? (
//         <div>
//           <p>Current Avatar: {user?.avatar}</p>
//           <input type="file" accept="image/*" onChange={handleAvatarUpload} />
//         </div>
//       ) : (
//         <p>User not authenticated</p>
//       )}
//     </div>
//   );
// };

// export default AvatarUploader;
