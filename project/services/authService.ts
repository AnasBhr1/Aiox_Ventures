import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'https://api.example.com';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

// For demo purposes, we'll mock the API call
export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  try {
    // In a real app, this would be a real API call
    // const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    // return response.data;
    
    // Mock response for demo
    if (email === 'demo@example.com' && password === 'password') {
      // Generate a mock JWT token that expires in 1 hour
      const now = Math.floor(Date.now() / 1000);
      const payload = {
        sub: '1',
        email: 'demo@example.com',
        name: 'Demo User',
        exp: now + 3600, // 1 hour from now
      };
      
      // Mock JWT token (not a real token)
      const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify(payload))}.mockSignature`;
      
      return {
        token,
        user: {
          id: '1',
          email: 'demo@example.com',
          name: 'Demo User',
        },
      };
    } else {
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to login');
    }
    throw error;
  }
}

export async function registerUser(name: string, email: string, password: string): Promise<LoginResponse> {
  try {
    // In a real app, this would be a real API call
    // const response = await axios.post(`${API_URL}/auth/register`, { name, email, password });
    // return response.data;
    
    // Mock response for demo
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      sub: '2',
      email,
      name,
      exp: now + 3600, // 1 hour from now
    };
    
    // Mock JWT token (not a real token)
    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify(payload))}.mockSignature`;
    
    return {
      token,
      user: {
        id: '2',
        email,
        name,
      },
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to register');
    }
    throw error;
  }
}

export async function getUserProfile(token: string): Promise<any> {
  try {
    // In a real app, this would be a real API call with the token in headers
    // const response = await axios.get(`${API_URL}/me`, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    // return response.data;
    
    // For demo, just decode the token
    const decoded = jwtDecode(token);
    return {
      id: decoded.sub,
      email: decoded.email,
      name: decoded.name,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to get user profile');
    }
    throw error;
  }
}