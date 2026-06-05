import { api } from './axios';

export interface LoginResponse {
  access_token: string;
}

export interface RegisterResponse {
  access_token?: string; // registration might also return a token directly
  message?: string;
}

export const authService = {
  async register(data: any): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>('/auth/register', data);
    return response.data;
  },

  async login(data: any): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', data);
    return response.data;
  },
};
