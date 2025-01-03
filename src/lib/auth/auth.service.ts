import { User, UserRole } from '../../types';
import { users } from './users';

export const authService = {
  login: async (email: string, password: string): Promise<Omit<User, 'password'>> => {
    const user = users.find(
      (u) => u.email === email && u.password === password
    );
    
    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  register: async (
    name: string, 
    email: string, 
    password: string, 
    role: UserRole
  ): Promise<Omit<User, 'password'>> => {
    if (users.some((u) => u.email === email)) {
      throw new Error('Email já cadastrado');
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role,
      password,
    };

    users.push(newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },
};