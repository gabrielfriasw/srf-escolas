import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '../types';

interface AuthState {
  user: Omit<User, 'password'> | null;
  users: User[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  register: (name: string, email: string, password: string, role: UserRole) => void;
  logout: () => void;
  findUserByEmail: (email: string) => Promise<Omit<User, 'password'> | null>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      users: [],
      isAuthenticated: false,
      login: (email: string, password: string) => {
        const { users } = get();
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
        const { users } = get();
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

        set(state => ({ 
          users: [...state.users, newUser],
          user: { id: newUser.id, name, email, role },
          isAuthenticated: true 
        }));
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      findUserByEmail: async (email: string) => {
        const { users } = get();
        const user = users.find(u => u.email === email);
        if (!user) return null;
        
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);