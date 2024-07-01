// context/WebSocketProvider.js

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useGlobalContext } from './GlobalProvider';

const WebSocketContext = createContext();

export const useWebSocket = () => useContext(WebSocketContext);

const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useGlobalContext();

  useEffect(() => {
    if (user) {
      // Replace with your actual WebSocket server URL
      const ws = new WebSocket('ws://localhost:8080');

      ws.onopen = () => {
        console.log('WebSocket Client Connected');
        setSocket(ws);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // Handle incoming messages here
        console.log('Received message:', data);
      };

      ws.onerror = (error) => {
        console.log('WebSocket Error: ', error);
      };

      ws.onclose = () => {
        console.log('WebSocket Disconnected');
      };

      return () => {
        ws.close();
      };
    }
  }, [user]);

  const sendMessage = (message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    } else {
      console.log('WebSocket is not connected.');
    }
  };

  return (
    <WebSocketContext.Provider value={{ socket, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;