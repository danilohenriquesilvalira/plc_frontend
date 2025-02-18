import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Criar uma instância do axios com configuração base
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Interfaces
export interface Tag {
  id: number;
  plc_id: number;
  name: string;
  db_number: number;
  byte_offset: number;
  data_type: string;
  can_write: boolean;
  scan_rate: number;
  monitor_changes: boolean;
  active: boolean;
  value?: any;
}

export interface PLC {
  id: number;
  name: string;
  ip_address: string;
  rack: number;
  slot: number;
  active: boolean;
  status: string;
  last_update: string;
  tags?: Tag[];
  tag_count?: number; // Novo campo para a contagem de tags
}

// PLC endpoints
export const getPLCs = async (): Promise<PLC[]> => {
  const response = await api.get('/plcs');
  return response.data;
};

export const getPLC = async (id: number): Promise<PLC> => {
  const response = await api.get(`/plcs/${id}`);
  return response.data;
};

export const createPLC = async (data: Partial<PLC>): Promise<PLC> => {
  const response = await api.post('/plcs', data);
  return response.data;
};

export const updatePLC = async (id: number, data: Partial<PLC>): Promise<void> => {
  await api.put(`/plcs/${id}`, data);
};

export const deletePLC = async (id: number): Promise<void> => {
  await api.delete(`/plcs/${id}`);
};

// Nova função para reiniciar o PLC
export const restartPLC = async (id: number): Promise<void> => {
  await api.post(`/plcs/${id}/restart`);
};

// Tags endpoints
export const getTags = async (plcId: number): Promise<Tag[]> => {
  const response = await api.get(`/plcs/${plcId}/tags`);
  return response.data;
};

export const getTag = async (tagId: number): Promise<Tag> => {
  const response = await api.get(`/tags/${tagId}`);
  return response.data;
};

export const createTag = async (plcId: number, data: Partial<Tag>): Promise<Tag> => {
  const response = await api.post(`/plcs/${plcId}/tags`, data);
  return response.data;
};

export const updateTag = async (tagId: number, data: Partial<Tag>): Promise<void> => {
  await api.put(`/tags/${tagId}`, data);
};

export const deleteTag = async (tagId: number): Promise<void> => {
  await api.delete(`/tags/${tagId}`);
};
