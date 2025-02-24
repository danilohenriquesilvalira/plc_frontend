// Interface para métricas de servidor
export interface ServerMetrics {
  cpu: {
    usage: number;
    cores: number;
    status: string;
  };
  memory: {
    total: number;
    used: number;
    usedPercent: number;
    status: string;
  };
  disk: {
    total: number;
    used: number;
    usedPercent: number;
    status: string;
  };
  network: {
    bytesSent: number;
    bytesReceived: number;
    status: string;
  };
  system: {
    hostname: string;
    platform: string;
    uptime: number;
    bootTime: string;
    processes: number;
  };
}

// Interface para métricas de banco de dados
export interface DatabaseMetrics {
  postgresql: {
    status: string;
    connections: number;
    size: number;
    queriesPerSec: number;
    replicationLag: number;
  };
  timescaledb: {
    status: string;
    chunks: number;
    size: number;
    compressionRatio: number;
    retentionPolicy: string;
  };
  redis: {
    status: string;
    connections: number;
    memory: number;
    memoryUsage: number;
    keyCount: number;
    hitRate: number;
  };
  mariadb: {
    status: string;
    connections: number;
    size: number;
    queriesPerSec: number;
    slowQueries: number;
  };
}

// Interface para mensagens WebSocket de monitoramento
export interface MonitoringWSMessage {
  type: string;
  target?: string;
  metrics?: ServerMetrics | DatabaseMetrics;
  timestamp?: string;
}

// Opções para conexão WebSocket
export interface WebSocketOptions {
  onServerMetrics?: (data: ServerMetrics) => void;
  onDatabaseMetrics?: (data: DatabaseMetrics) => void;
  onError?: (err: Event) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

/**
 * Estabelece conexão WebSocket para monitoramento do sistema
 */
export const connectMonitoringWebSocket = (options: WebSocketOptions) => {
  // URL do WebSocket para monitoramento
  const ws = new WebSocket('ws://localhost:8080/ws/monitoring');
  
  // Evento de abertura da conexão
  ws.onopen = () => {
    console.log('Conexão WebSocket de monitoramento estabelecida.');
    if (options.onConnect) options.onConnect();
  };
  
  // Processar mensagens recebidas
  ws.onmessage = (event) => {
    try {
      const message: MonitoringWSMessage = JSON.parse(event.data);
      console.log('Mensagem de monitoramento recebida:', message);
      
      // Roteamento baseado no tipo de métrica
      if (message.type === 'metrics') {
        if (message.target === 'server' && options.onServerMetrics) {
          options.onServerMetrics(message.metrics as ServerMetrics);
        } 
        else if (message.target === 'databases' && options.onDatabaseMetrics) {
          options.onDatabaseMetrics(message.metrics as DatabaseMetrics);
        }
      }
    } catch (error) {
      console.error('Erro ao processar mensagem de monitoramento:', error);
    }
  };
  
  // Tratamento de erros
  ws.onerror = (error) => {
    console.error('Erro no WebSocket de monitoramento:', error);
    if (options.onError) options.onError(error);
  };
  
  // Evento de fechamento da conexão
  ws.onclose = () => {
    console.log('Conexão WebSocket de monitoramento fechada.');
    if (options.onDisconnect) options.onDisconnect();
  };
  
  // Métodos de controle de assinatura
  const subscribe = (target: string) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'subscribe', target }));
    }
  };
  
  const unsubscribe = (target: string) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'unsubscribe', target }));
    }
  };
  
  // Ping para manter a conexão ativa
  const pingInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'ping' }));
    }
  }, 30000);
  
  // Retornar objeto com métodos de controle
  return {
    socket: ws,
    subscribe,
    unsubscribe,
    close: () => {
      clearInterval(pingInterval);
      ws.close();
    }
  };
};