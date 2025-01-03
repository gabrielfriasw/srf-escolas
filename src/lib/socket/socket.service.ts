import { io } from 'socket.io-client';
import { defaultConfig } from './socket.config';

class SocketService {
  private socket;

  constructor() {
    this.socket = io(defaultConfig.endpoint, {
      path: defaultConfig.path,
      transports: defaultConfig.transports,
    });

    this.setupListeners();
  }

  private setupListeners() {
    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });
  }

  emitUpdate(type: string, data: unknown) {
    this.socket.emit('update', { type, data });
  }

  onUpdate(callback: (data: { type: string; data: unknown }) => void) {
    this.socket.on('update', callback);
  }

  disconnect() {
    this.socket.disconnect();
  }
}

export const socketService = new SocketService();