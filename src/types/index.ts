export interface PLC {
  id: number;
  name: string;
  ip_address: string;
  rack: number;
  slot: number;
  active: boolean;
  status: string;
  last_update: string;
}

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
}

export interface WSMessage {
  plc_id: number;
  status: string;
  last_update: string;
}


// Interfaces existentes

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