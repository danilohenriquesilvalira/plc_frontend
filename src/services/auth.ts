import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    role: string;
    created_at: string;
    updated_at: string;
  };
}

export interface CreateUserRequest {
  username: string;
  password: string;
  role: string;
}

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  console.log("Enviando requisição de login com:", data);
  const response = await axios.post<LoginResponse>(`${API_URL}/login`, data, {
    headers: { 'Content-Type': 'application/json' },
  });
  console.log("Resposta recebida do login:", response.data);
  return response.data;
};

export const register = async (data: CreateUserRequest, token: string): Promise<any> => {
  const response = await axios.post(`${API_URL}/register`, data, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data;
};
