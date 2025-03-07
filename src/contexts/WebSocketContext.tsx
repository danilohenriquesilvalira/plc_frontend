import React, { createContext, useContext, useEffect, useState } from 'react';
import { WSMessage, connectWebSocket } from '../services/websocket';

interface WebSocketContextType {
  message: WSMessage | null;
}

const WebSocketContext = createContext<WebSocketContextType>({ message: null });

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [message, setMessage] = useState<WSMessage | null>(null);

  useEffect(() => {
    const ws = connectWebSocket((data) => {
      console.log('Mensagem recebida no contexto:', data);
      setMessage(data);
    });
    return () => {
      ws.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ message }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
