import axios from "axios";
import { store } from "./redux/store";

const PUBLIC_API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'ngrok-skip-browser-warning': 'true',
  },
});

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

API.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  console.log("🔐 Token in interceptor:", token); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (!config.headers["ngrok-skip-browser-warning"]) {
    config.headers["ngrok-skip-browser-warning"] = "true";
  }
  return config;
});


const BACKEND = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'ngrok-skip-browser-warning': 'true',
  },
});

export { API, BACKEND, PUBLIC_API };
