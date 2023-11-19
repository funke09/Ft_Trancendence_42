import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  signInWith42: () => void; // Example method, modify as needed
  signOut: () => void; // Example method, modify as needed
  // Add other authentication-related methods as needed
}

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface AuthProviderProps {
	children: ReactNode;
  }

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Example: Implement signInWith42, signOut, and other authentication-related methods

  useEffect(() => {
    // Check if the user is already authenticated (e.g., from a previous session)
    // Update state accordingly
  }, []);

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    signInWith42: () => {
      // Implement the sign-in logic with 42 API
    },
    signOut: () => {
      // Implement the sign-out logic
    },
    // Add other authentication-related methods as needed
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
