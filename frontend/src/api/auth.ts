import api from './axios';
import type { User } from '../types';

export const login = async (email: string, password: string) => {
  const { data } = await api.post<{ user: User; token: string }>('/login', { email, password });
  return data;
};

export const logout = async () => {
  await api.post('/logout');
};

export const getMe = async () => {
  const { data } = await api.get<User>('/me');
  return data;
};

export const updateProfile = async (payload: { name?: string; theme?: string; language?: string }) => {
  const { data } = await api.put<{ message: string; user: User }>('/profile', payload);
  return data.user;
};
