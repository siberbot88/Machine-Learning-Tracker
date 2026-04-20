import api from './axios';
import type { DashboardData } from '../types';

export const getDashboard = async () => {
  const { data } = await api.get<DashboardData>('/dashboard');
  return data;
};
