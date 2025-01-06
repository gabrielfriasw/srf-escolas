import { io } from 'socket.io-client';

// Connect to Netlify Function WebSocket endpoint
export const socket = io('/.netlify/functions/websocket', {
  path: '/socket.io',
  transports: ['websocket'],
});

// Listen for connection events
socket.on('connect', () => {
  console.log('Connected to WebSocket server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from WebSocket server');
});

// Helper function to emit updates
export const emitUpdate = (type: string, data: any) => {
  socket.emit('update', { type, data });
};