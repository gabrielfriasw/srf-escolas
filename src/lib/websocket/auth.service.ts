import { io } from 'socket.io-client';
import { User, UserRole } from '../../types';

const socket = io('/.netlify/functions/websocket', {
  path: '/socket.io',
  transports: ['websocket'],
});

export const authService = {
  socket,

  emitAuthEvent: (type: string, data: any) => {
    return new Promise((resolve, reject) => {
      socket.emit(type, data, (response: { error?: string; data?: any }) => {
        if (response.error) {
          reject(new Error(response.error));
        } else {
          resolve(response.data);
        }
      });
    });
  },

  onUserUpdate: (callback: (users: Omit<User, 'password'>[]) => void) => {
    socket.on('users_updated', callback);
    return () => socket.off('users_updated', callback);
  },
};