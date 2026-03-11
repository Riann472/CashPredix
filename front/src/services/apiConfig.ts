import axios from 'axios';

export interface AuthResponse {
  sub: number;
  email: string;
  name: string;
}

export const apiConfig = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

apiConfig.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;

      if (currentPath !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);