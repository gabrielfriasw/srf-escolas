import { Server, Socket } from 'socket.io';
import { User, UserRole } from '../../../src/types';

// In-memory users store
const users: User[] = [
  {
    id: '1',
    name: 'Admin',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'COORDINATOR',
  },
];

export const setupAuthHandlers = (io: Server, socket: Socket) => {
  const broadcastUsers = () => {
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    io.emit('users_updated', usersWithoutPasswords);
  };

  socket.on('login', async (data, callback) => {
    try {
      const user = users.find(
        (u) => u.email === data.email && u.password === data.password
      );

      if (!user) {
        callback({ error: 'Credenciais inválidas' });
        return;
      }

      const { password, ...userWithoutPassword } = user;
      callback({ data: userWithoutPassword });
    } catch (error) {
      callback({ error: 'Erro ao fazer login' });
    }
  });

  socket.on('register', async (data, callback) => {
    try {
      if (users.some((u) => u.email === data.email)) {
        callback({ error: 'Email já cadastrado' });
        return;
      }

      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role as UserRole,
      };

      users.push(newUser);

      const { password, ...userWithoutPassword } = newUser;
      callback({ data: userWithoutPassword });
      
      // Broadcast updated users list
      broadcastUsers();
    } catch (error) {
      callback({ error: 'Erro ao registrar usuário' });
    }
  });

  socket.on('logout', (_, callback) => {
    callback({ data: true });
  });

  // Send initial users list when client connects
  broadcastUsers();
};