export interface Tag {
  id: number;
  name: string;
  value: any;
}

export interface WSMessage {
  plc: {
    plc_id: number;
    status: string;
    last_update: string;
  };
  tags: Tag[];
}

export const connectWebSocket = (
  onMessage: (data: WSMessage) => void,
  onError?: (err: Event) => void
) => {
  const ws = new WebSocket('ws://localhost:8080/ws/status');
  ws.onopen = () => {
    console.log('WebSocket connection established.');
  };
  ws.onmessage = (event) => {
    try {
      const data: WSMessage = JSON.parse(event.data);
      console.log('Mensagem recebida do WebSocket:', data);
      onMessage(data);
    } catch (error) {
      console.error('Erro ao parsear mensagem:', error);
    }
  };
  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    if (onError) onError(error);
  };
  ws.onclose = () => {
    console.log('WebSocket connection closed.');
  };
  return ws;
};
