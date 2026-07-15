import axios from 'axios';
import { useAuthStore } from '../stores/auth.store';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const user = useAuthStore.getState().user;
      if (user?.refreshToken) {
        try {
          const { data } = await axios.post(`${API_URL}/auth/refresh`, {
            token: user.refreshToken,
          });
          useAuthStore.getState().login(data);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        } catch {
          useAuthStore.getState().logout();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  },
);

export interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}

export async function gql<T>(
  query: string,
  variables?: Record<string, any>,
): Promise<T> {
  const token = useAuthStore.getState().getToken();
  const { data } = await api.post<GraphQLResponse<T>>('/graphql', {
    query,
    variables,
  }, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (data.errors?.length) {
    throw new Error(data.errors[0].message);
  }

  return data.data;
}
