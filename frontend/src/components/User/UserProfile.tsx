import React from 'react';
import { useAuth } from '../Auth/AvatarUploader'; // Update with your actual path

const UserProfile: React.FC = () => {
  const { user, isAuthenticated, signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <h2>User Profile</h2>
          <p>Name: {user?.name}</p>
          <p>Avatar: {user?.avatar}</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      ) : (
        <p>User not authenticated</p>
      )}
    </div>
  );
};

export default UserProfile;