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

// Novas interfaces para tabelas e colunas
export interface ColumnMetadata {
  id: number;
  table_id: number;
  column_name: string;
  data_type: string;
  description: string;
  tag_id?: number;
  plc_id?: number;
  is_timestamp: boolean;
  created_at: string;
  updated_at: string;
}

export interface TableMetadata {
  id: number;
  table_name: string;
  description: string;
  storage_type: 'permanent' | 'timeseries';
  retention_days?: number; // Apenas para TimescaleDB
  created_at: string;
  updated_at: string;
  columns?: ColumnMetadata[];
}

export interface TagMapping {
  tag_id: number;
  tag_name: string;
  plc_id: number;
  plc_name: string;
  table_id: number;
  table_name: string;
  column_id: number;
  column_name: string;
  storage_type: 'permanent' | 'timeseries';
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


// Tabelas permanentes (PostgreSQL)
export const getPermanentTables = async (): Promise<TableMetadata[]> => {
  const response = await api.get('/permanent/tables');
  return response.data;
};

export const getPermanentTable = async (id: number): Promise<TableMetadata> => {
  const response = await api.get(`/permanent/tables/${id}`);
  return response.data;
};

export const createPermanentTable = async (data: Partial<TableMetadata>): Promise<TableMetadata> => {
  const response = await api.post('/permanent/tables', {
    ...data,
    storage_type: 'permanent'
  });
  return response.data;
};

export const deletePermanentTable = async (id: number): Promise<void> => {
  await api.delete(`/permanent/tables/${id}`);
};

// Tabelas de séries temporais (TimescaleDB)
export const getTimeSeriesTables = async (): Promise<TableMetadata[]> => {
  const response = await api.get('/timeseries/tables');
  return response.data;
};

export const getTimeSeriesTable = async (id: number): Promise<TableMetadata> => {
  const response = await api.get(`/timeseries/tables/${id}`);
  return response.data;
};

export const createTimeSeriesTable = async (data: Partial<TableMetadata>): Promise<TableMetadata> => {
  const response = await api.post('/timeseries/tables', {
    ...data,
    storage_type: 'timeseries'
  });
  return response.data;
};

export const deleteTimeSeriesTable = async (id: number): Promise<void> => {
  await api.delete(`/timeseries/tables/${id}`);
};

// Todas as tabelas (combinação de permanentes e séries temporais)
export const getAllTables = async (): Promise<TableMetadata[]> => {
  const response = await api.get('/tables');
  return response.data;
};

// Colunas para tabelas permanentes
export const getPermanentColumns = async (tableId: number): Promise<ColumnMetadata[]> => {
  const response = await api.get(`/permanent/tables/${tableId}/columns`);
  return response.data;
};

export const addPermanentColumn = async (tableId: number, data: Partial<ColumnMetadata>): Promise<ColumnMetadata> => {
  const response = await api.post(`/permanent/tables/${tableId}/columns`, data);
  return response.data;
};

export const deletePermanentColumn = async (columnId: number): Promise<void> => {
  await api.delete(`/permanent/columns/${columnId}`);
};

// Colunas para tabelas de séries temporais
export const getTimeSeriesColumns = async (tableId: number): Promise<ColumnMetadata[]> => {
  const response = await api.get(`/timeseries/tables/${tableId}/columns`);
  return response.data;
};

export const addTimeSeriesColumn = async (tableId: number, data: Partial<ColumnMetadata>): Promise<ColumnMetadata> => {
  const response = await api.post(`/timeseries/tables/${tableId}/columns`, data);
  return response.data;
};

export const deleteTimeSeriesColumn = async (columnId: number): Promise<void> => {
  await api.delete(`/timeseries/columns/${columnId}`);
};

// Mapeamento de tags para colunas
export const mapTagToColumn = async (
  tagId: number, 
  tableId: number, 
  columnId: number, 
  plcId: number, 
  storageType: 'permanent' | 'timeseries'
): Promise<void> => {
  await api.post(`/tags/${tagId}/map`, {
    table_id: tableId,
    column_id: columnId,
    plc_id: plcId,
    storage_type: storageType
  });
};

export const getTagMappings = async (): Promise<TagMapping[]> => {
  const response = await api.get('/tags/mappings');
  return response.data;
};

// Consulta de dados
export const queryTimeSeriesData = async (
  tableId: number, 
  params?: { 
    start_time?: string, 
    end_time?: string, 
    limit?: number, 
    offset?: number,
    order_by?: string,
    direction?: 'ASC' | 'DESC'
  }
): Promise<any[]> => {
  const response = await api.get(`/timeseries/tables/${tableId}/data`, { params });
  return response.data;
};

export const queryPermanentData = async (
  tableId: number, 
  params?: { 
    limit?: number, 
    offset?: number,
    order_by?: string,
    direction?: 'ASC' | 'DESC',
    [key: string]: any
  }
): Promise<any[]> => {
  const response = await api.get(`/permanent/tables/${tableId}/data`, { params });
  return response.data;
};