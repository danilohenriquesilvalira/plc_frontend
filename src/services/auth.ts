// services/auth.ts
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

export interface User {
  id: number;
  username: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  role: string;
}

export interface UpdateUserRequest {
  username?: string;
  password?: string;
  role?: string;
}

// Login
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(`${API_URL}/login`, data, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

// Listar usuários
export const listUsers = async (token: string): Promise<User[]> => {
  const response = await axios.get<User[]>(`${API_URL}/users`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data;
};

// Criar usuário
export const createUser = async (data: CreateUserRequest, token: string): Promise<User> => {
  const response = await axios.post<User>(`${API_URL}/register`, data, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data;
};

// Atualizar usuário
export const updateUser = async (userId: number, data: UpdateUserRequest, token: string): Promise<User> => {
  const response = await axios.put<User>(`${API_URL}/update/${userId}`, data, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data;
};

// Deletar usuário
export const deleteUser = async (userId: number, token: string): Promise<void> => {
  await axios.delete(`${API_URL}/delete/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};