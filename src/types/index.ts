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
