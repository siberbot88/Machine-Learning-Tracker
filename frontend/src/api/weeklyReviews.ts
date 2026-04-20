import api from './axios';
import type { WeeklyReview } from '../types';

export const getWeeklyReviews = async () => {
  const { data } = await api.get<WeeklyReview[]>('/weekly-reviews');
  return data;
};

export const createWeeklyReview = async (review: Partial<WeeklyReview>) => {
  const { data } = await api.post<WeeklyReview>('/weekly-reviews', review);
  return data;
};

export const updateWeeklyReview = async (id: string, updates: Partial<WeeklyReview>) => {
  const { data } = await api.put<WeeklyReview>(`/weekly-reviews/${id}`, updates);
  return data;
};

export const generateAiFeedback = async (id: string) => {
  const { data } = await api.post<WeeklyReview>(`/weekly-reviews/${id}/generate-feedback`);
  return data;
};
