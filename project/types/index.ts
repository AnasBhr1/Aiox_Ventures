export interface POI {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  shortDescription: string;
  description: string;
  imageUrl: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}