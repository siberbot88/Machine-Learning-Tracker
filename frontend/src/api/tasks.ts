import api from './axios';
import type { Task, TaskFilters } from '../types';

export const getTasks = async (filters?: TaskFilters) => {
  const { data } = await api.get<Task[]>('/tasks', { params: filters });
  return data;
};

export const getTask = async (id: string) => {
  const { data } = await api.get<Task>(`/tasks/${id}`);
  return data;
};

export const createTask = async (task: Partial<Task>) => {
  const { data } = await api.post<Task>('/tasks', task);
  return data;
};

export const updateTask = async (id: string, updates: Partial<Task>) => {
  const { data } = await api.put<Task>(`/tasks/${id}`, updates);
  return data;
};

export const toggleTask = async (id: string) => {
  const { data } = await api.patch<Task>(`/tasks/${id}/toggle`);
  return data;
};

export const deleteTask = async (id: string) => {
  await api.delete(`/tasks/${id}`);
};

export const getPortfolio = async () => {
  const { data } = await api.get<Task[]>('/portfolio');
  return data;
};
