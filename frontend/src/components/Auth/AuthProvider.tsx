import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  signInWith42: () => void;
  signOut: () => void;
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

  const signInWith42 = () => {
    // Redirect users to request 42 access
    const clientId = 'u-s4t2ud-9fb204ce3909547c481b5b7f9a6b83721605b49f51d37b28d6449d4e564ed69f';
    const redirectUri = 'http://localhost:3000';
    const responseType = 'code';
    const authorizeUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}`;

    // Redirect the user to the authorization URL
    window.location.href = authorizeUrl;
  };

  const exchangeCodeForAccessToken = async (code: string) => {
    try {
      const response = await fetch('https://api.intra.42.fr/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: 'u-s4t2ud-9fb204ce3909547c481b5b7f9a6b83721605b49f51d37b28d6449d4e564ed69f',
          client_secret: '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',
          code: code,
          redirect_uri: 'http://localhost:3000', // Use the same redirect URI as in the authorization URL
        }).toString(),
      });

      if (!response.ok) {
        throw new Error('Failed to exchange code for access token');
      }

      const data = await response.json();

      // Fetch user information using the obtained access token
      const userResponse = await fetch('https://api.intra.42.fr/v2/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${data.access_token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user information');
      }

      const userData = await userResponse.json();

      // Update the user state with information from /v2/me
      setUser({
        id: userData.id,
        name: userData.login,
        avatar: userData.image.link,
      });

      // Update authentication status
      setIsAuthenticated(true);
	  localStorage.setItem('isAuthenticated', 'true');

    } catch (error) {
      console.error('Authentication failed', error);
      // Handle authentication failure
    }
  };

  const signOut = () => {
    // Implement the sign-out logic
    // Clear user state and set isAuthenticated to false
    setUser(null);
    setIsAuthenticated(false);
	localStorage.removeItem('isAuthenticated');
  };

  useEffect(() => {
    // Check if the user is already authenticated (e.g., from a previous session)
    // Update state accordingly

    // This can be done by checking the validity of the access token stored in the browser's localStorage or cookies
    const isAuthenticatedFromLocalStorage = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(isAuthenticatedFromLocalStorage);
	
	const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      // If there is a code in the URL, exchange it for an access token
      exchangeCodeForAccessToken(code);
    }
  }, []);

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    signInWith42,
    signOut,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
