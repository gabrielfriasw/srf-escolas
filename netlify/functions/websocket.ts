import { Handler } from '@netlify/functions';
import { Server } from 'socket.io';

let io: Server;

const handler: Handler = async (event, context) => {
  if (!io) {
    // Initialize Socket.IO server
    io = new Server({
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    // Handle connections
    io.on('connection', (socket) => {
      console.log('Client connected');

      // Handle updates
      socket.on('update', (data) => {
        // Broadcast update to all other clients
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