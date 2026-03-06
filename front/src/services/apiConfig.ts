import axios from 'axios';

export const apiConfig = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

