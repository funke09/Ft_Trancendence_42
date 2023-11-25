import React from 'react';
import { useAuth } from '../Auth/AuthProvider';

const UserProfile: React.FC = () => {
  const { user, isAuthenticated, signOut } = useAuth();

  const handleSignOut = () => {
    // Call signOut when the sign-out button is clicked
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
