import api from './axios';
import type { Submission } from '../types';

export const getSubmissions = async (taskId: string) => {
  const { data } = await api.get<Submission[]>(`/tasks/${taskId}/submissions`);
  return data;
};

export const createSubmission = async (taskId: string, formData: FormData) => {
  const { data } = await api.post<Submission>(`/tasks/${taskId}/submissions`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const getSubmission = async (id: string) => {
  const { data } = await api.get<Submission>(`/submissions/${id}`);
  return data;
};

export const updateSubmission = async (id: string, updates: Partial<Submission>) => {
  const { data } = await api.put<Submission>(`/submissions/${id}`, updates);
  return data;
};

export const deleteSubmission = async (id: string) => {
  await api.delete(`/submissions/${id}`);
};

export const generateAiReview = async (id: string) => {
  const { data } = await api.post<Submission>(`/submissions/${id}/ai-review`);
  return data;
};
