import axios from 'axios';

const API_URL = '/api/v1';

export async function login(email: string, password: string) {
  const params = new URLSearchParams();
  params.append('username', email);
  params.append('password', password);
  params.append('grant_type', '');
  params.append('scope', '');
  params.append('client_id', '');
  params.append('client_secret', '');
  const response = await axios.post(`${API_URL}/login/access-token`, params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return response.data;
}

export function setToken(token: string) {
  localStorage.setItem('access_token', token);
}

export function getToken(): string | null {
  return localStorage.getItem('access_token');
}
