import React, { createContext, useState, useContext, useEffect } from 'react';
import { router, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { loginUser } from '@/services/authService';
import { jwtDecode } from 'jwt-decode';

// Mock data for development
const DEMO_USER = {
  id: '1',
  email: 'demo@example.com',
  name: 'Demo User',
  avatar: 'https://i.pravatar.cc/150?u=demo@example.com'
};

// Define the shape of the JWT token payload
interface JwtPayload {
  sub: string;
  email: string;
  name?: string;
  exp: number;
}

// Define user shape
interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

// Define auth context shape
interface AuthContextType {
  user: User | null;
  token: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  isLoading: boolean;
  error: string | null;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  signIn: async () => {},
  signOut: () => {},
  isLoading: false,
  error: null,
});

// For web, use localStorage instead of SecureStore
const tokenStorage = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    return SecureStore.deleteItemAsync(key);
  },
};

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const segments = useSegments();

  // Check if we're in an auth group
  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';
    
    if (!user && !isLoading && !inAuthGroup) {
      // If no user and not in auth group, redirect to login
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      // If user is logged in and in auth group, redirect to main app
      router.replace('/(tabs)');
    }
  }, [user, segments, isLoading]);

  // Load token on startup
  useEffect(() => {
    async function loadToken() {
      try {
        const storedToken = await tokenStorage.getItem('authToken');
        
        if (storedToken) {
          setToken(storedToken);
          
          try {
            // Verify token and get user info
            const decoded = jwtDecode<JwtPayload>(storedToken);
            
            // Check if token is expired
            const currentTime = Date.now() / 1000;
            if (decoded.exp < currentTime) {
              // Token expired, sign out
              await tokenStorage.removeItem('authToken');
              setToken(null);
              setUser(null);
            } else {
              // Valid token, set user
              setUser({
                id: decoded.sub,
                email: decoded.email,
                name: decoded.name,
                avatar: `https://i.pravatar.cc/150?u=${decoded.email}`
              });
            }
          } catch (e) {
            // Invalid token
            await tokenStorage.removeItem('authToken');
            setToken(null);
          }
        }
      } catch (e) {
        console.error('Failed to load auth token', e);
      } finally {
        setIsLoading(false);
      }
    }

    loadToken();
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would make a request to your auth API
      const response = await loginUser(email, password);
      
      if (response.token) {
        await tokenStorage.setItem('authToken', response.token);
        setToken(response.token);
        
        try {
          const decoded = jwtDecode<JwtPayload>(response.token);
          setUser({
            id: decoded.sub,
            email: decoded.email,
            name: decoded.name,
            avatar: `https://i.pravatar.cc/150?u=${decoded.email}`
          });
        } catch (e) {
          throw new Error('Invalid token received');
        }
      } else {
        throw new Error('No token received');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to sign in');
      // For demo purposes, log in with mock user
      if (email === 'demo@example.com' && password === 'password') {
        setUser(DEMO_USER);
        const mockToken = 'mock.jwt.token';
        setToken(mockToken);
        await tokenStorage.setItem('authToken', mockToken);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await tokenStorage.removeItem('authToken');
    } catch (e) {
      console.error('Error removing token', e);
    } finally {
      setToken(null);
      setUser(null);
      router.replace('/(auth)/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, signIn, signOut, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);