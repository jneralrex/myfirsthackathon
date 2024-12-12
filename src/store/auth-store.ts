import { create } from 'zustand';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  name: string;
}

interface Location {
  state: string;
  ward?: string;
  lga?: string;
  address?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    middleName: string,
    contact: string,
    address: string,
    location: Location
  ) => Promise<void>;
  logout: () => void;
}

const base_url = import.meta.env.VITE_API_URL;

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (email: string, password: string) => {
    try {
      const response = await axios.post(`${base_url}/auth/login`, { email, password });
      const { id, name } = response.data.data.user;
  
      // Store user data in localStorage
      localStorage.setItem('SOIL_TESTER', JSON.stringify(response.data.data));
  
      // Update the state
      set({ user: { id, email, name }, isAuthenticated: true });
    } catch (err) {
      console.error(
        'Login failed:',
        (err as any)?.response?.data?.message || (err as Error)?.message || 'Unknown error'
      );
      throw new Error(
        (err as any)?.response?.data?.message || (err as Error)?.message || 'Failed to login'
      );
    }
  },  
  register: async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    middleName: string,
    contact: string,
    address: string,
    location: Location
  ) => {
    try {
      const response = await axios.post(`${base_url}/auth/register`, {
        email,
        password,
        firstName,
        lastName,
        middleName,
        contact,
        address,
        location,
      });
      console.log(response, "res")
      const { id } = response.data.data.user;
      set({ user: { id, email, name: `${firstName} ${lastName}` }, isAuthenticated: true });
    } catch (err) {
      console.error('Registration failed:', (err as any)?.response?.data?.message || (err as Error)?.message || 'Unknown error');
      throw new Error(
        (err as any)?.response?.data?.message || (err as Error)?.message || 'Failed to register'
      );
    }
  },
  logout: () => {
    localStorage.removeItem('authToken');
    set({ user: null, isAuthenticated: false });
  },
}));
