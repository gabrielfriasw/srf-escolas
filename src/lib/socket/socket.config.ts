import { io, Socket } from 'socket.io-client';

export interface SocketConfig {
  endpoint: string;
  path: string;
  transports: string[];
}

export const defaultConfig: SocketConfig = {
  endpoint: '/.netlify/functions/websocket',
  path: '/socket.io',
  transports: ['websocket'],
};