import { Handler } from '@netlify/functions';
import { Server } from 'socket.io';
import { socketConfig } from './websocket.config';

let io: Server;

const handler: Handler = async (event, context) => {
  if (!io) {
    io = new Server(socketConfig);

    io.on('connection', (socket) => {
      console.log('Client connected');

      socket.on('update', (data) => {
        socket.broadcast.emit('update', data);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });
  }

  return {
    statusCode: 200,
    body: 'WebSocket server running',
  };
};

export { handler };