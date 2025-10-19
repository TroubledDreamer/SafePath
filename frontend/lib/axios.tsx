import axios from 'axios';
import { Platform } from 'react-native';
import { getUserToken } from './auth'; // make sure this path is correct


const API_ORIGIN = process.env.EXPO_PUBLIC_API_BASE_URL; // set via `eas env`
if (!API_ORIGIN) {
  console.warn('EXPO_PUBLIC_API_BASE_URL is missing');
}

const baseURL = `${API_ORIGIN?.replace(/\/$/, '')}/api/v1`;


// const baseURL =
//   Platform.OS === 'android'
//     ? 'https://pnote-api.bravebush-0c20dff7.eastus2.azurecontainerapps.io/api/v1'
//     : 'https://pnote-api.bravebush-0c20dff7.eastus2.azurecontainerapps.io/api/v1';

const api = axios.create({
  baseURL, // ⚠️ Replace with your LAN IP on a real device
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically add token to every request (if available)
api.interceptors.request.use(async (config) => {
  const token = await getUserToken();

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // console.log('📤 Axios config before request:', JSON.stringify(config, null, 2)); // 👈 log this
  return config;
});



export default api;
