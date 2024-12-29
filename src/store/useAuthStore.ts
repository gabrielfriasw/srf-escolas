import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '../types';

interface AuthState {
  user: Omit<User, 'password'> | null;
  isAuthenticated: boolean;
  users: User[];
  login: (email: string, password: string) => void;
  register: (name: string, email: string, password: string, role: UserRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      users: [
        {
          id: '1',
          name: 'Admin',
          email: 'admin@example.com',
          password: 'admin123',
          role: 'COORDINATOR',
        },
      ],
      login: (email: string, password: string) => {
        const { users } = get();
        const user = users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        
        if (!user) {
          throw new Error('Credenciais inválidas');
        }

        const { password: _, ...userWithoutPassword } = user;
        set({ user: userWithoutPassword, isAuthenticated: true });
      },
      register: (name: string, email: string, password: string, role: UserRole) => {
        const { users } = get();
        if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
          throw new Error('Email já cadastrado');
        }

        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          name,
          email: email.toLowerCase(),
          password,
          role,
        };

        set((state) => ({
          users: [...state.users, newUser],
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
          },
          isAuthenticated: true,
        }));
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