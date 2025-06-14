import axios from 'axios';
import { getToken } from './auth';

const API_URL = '/api/v1/users';

function getAuthHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getUsers() {
  const response = await axios.get(API_URL, { headers: getAuthHeaders() });
  return response.data;
}

export async function getMe() {
  const response = await axios.get(`${API_URL}/me`, { headers: getAuthHeaders() });
  return response.data;
}
