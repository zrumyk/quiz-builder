import axios from 'axios';
import type { CreateQuizPayload, Quiz, QuizSummary } from '../types/quiz';
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});
apiClient.interceptors.request.use((config) => {
  if (!import.meta.env.VITE_API_URL)
    throw new Error('API URL is not configured.');
  return config;
});
interface ApiResponse<T> {
  success: boolean;
  data: T;
}
export async function getQuizzes(signal?: AbortSignal): Promise<QuizSummary[]> {
  const response = await apiClient.get<ApiResponse<QuizSummary[]>>('/quizzes', {
    signal,
  });
  return response.data.data;
}
export async function getQuiz(id: string, signal?: AbortSignal): Promise<Quiz> {
  const response = await apiClient.get<ApiResponse<Quiz>>(
    '/quizzes/' + encodeURIComponent(id),
    { signal },
  );
  return response.data.data;
}
export async function createQuiz(data: CreateQuizPayload): Promise<Quiz> {
  const response = await apiClient.post<ApiResponse<Quiz>>('/quizzes', data);
  return response.data.data;
}
export async function deleteQuiz(id: string): Promise<void> {
  await apiClient.delete('/quizzes/' + encodeURIComponent(id));
}
export function isNotFound(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 404;
}
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    if (!error.response) return 'Cannot reach the server.';
    return error.response.data?.message || 'Request failed.';
  }
  return error instanceof Error ? error.message : 'Request failed.';
}
