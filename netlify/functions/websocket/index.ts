import { Handler } from '@netlify/functions';
import { Server } from 'socket.io';
import { setupAuthHandlers } from './auth.handler';

let io: Server;

const handler: Handler = async (event, context) => {
  if (!io) {
    io = new Server({
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      console.log('Client connected');
      
      // Set up authentication handlers
      setupAuthHandlers(io, socket);

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