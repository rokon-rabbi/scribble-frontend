import axios from 'axios';
import { useAuthStore } from '@/stores/useAuthStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 → logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ============ Auth API ============
export const authApi = {
  register: (data: { username: string; email: string; password: string }) =>
    api.post('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
};

// ============ Player API ============
export const playerApi = {
  getProfile: () => api.get('/players/me'),

  getLeaderboard: (page = 0, size = 20) =>
    api.get(`/players/leaderboard?page=${page}&size=${size}`),
};

// ============ Game API ============
export const gameApi = {
  createRoom: (data: { maxPlayers: number; roundsPerPlayer: number; turnTimeSeconds: number }) =>
    api.post('/games', data),

  listPublicRooms: (page = 0, size = 20) =>
    api.get(`/games/public?page=${page}&size=${size}`),

  getRoomInfo: (roomCode: string) =>
    api.get(`/games/${roomCode}`),
};
