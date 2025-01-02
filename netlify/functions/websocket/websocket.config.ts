import { ServerOptions } from 'socket.io';

export const socketConfig: Partial<ServerOptions> = {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
};