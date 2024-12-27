import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '../types';

interface AuthState {
  user: Omit<User, 'password'> | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  register: (name: string, email: string, password: string, role: UserRole) => void;
  logout: () => void;
}

// Mock users storage
const users: User[] = [
  {
    id: '1',
    name: 'Admin',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'COORDINATOR',
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email: string, password: string) => {
        const user = users.find(
          (u) => u.email === email && u.password === password
        );
        
        if (!user) {
          throw new Error('Credenciais inválidas');
        }

        const { password: _, ...userWithoutPassword } = user;
        set({ user: userWithoutPassword, isAuthenticated: true });
      },
      register: (name: string, email: string, password: string, role: UserRole) => {
        if (users.some((u) => u.email === email)) {
          throw new Error('Email já cadastrado');
        }

        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          name,
          email,
          password,
          role,
        };

        users.push(newUser);
        const { password: _, ...userWithoutPassword } = newUser;
        set({ user: userWithoutPassword, isAuthenticated: true });
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);