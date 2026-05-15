import axios from 'axios';

// Ensure the API URL has a protocol prefix
let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
if (API_URL && !API_URL.startsWith('http://') && !API_URL.startsWith('https://')) {
  API_URL = `https://${API_URL}`;
}
// Remove trailing slash if present
API_URL = API_URL.replace(/\/+$/, '');

console.log('=== API CONFIG ===');
console.log('API_URL:', API_URL);

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

export async function registerUser(username, password) {
  const response = await api.post('/register', { username, password });
  return response.data;
}

export async function loginUser(username, password) {
  const response = await api.post('/login', { username, password });
  return response.data;
}

export default {
  registerUser,
  loginUser
};