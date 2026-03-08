import axios from 'axios';

export interface AuthResponse {
  sub: number;
  email: string;
  name: string;
}

export const apiConfig = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

