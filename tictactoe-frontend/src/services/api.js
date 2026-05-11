import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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