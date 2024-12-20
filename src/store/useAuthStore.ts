import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  registrationAttempts: { timestamp: number; ip: string }[];
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

const MAX_REGISTRATION_ATTEMPTS = 5;
const TIME_WINDOW_MINUTES = 60;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      registrationAttempts: [],
      login: async (email: string, password: string) => {
        const storedUser = localStorage.getItem(`user_${email}`);
        if (storedUser) {
          const user = JSON.parse(storedUser);
          if (user.email === email) {
            set({ user, isAuthenticated: true });
            return;
          }
        }
        throw new Error('Credenciais inválidas');
      },
      register: async (name: string, email: string, password: string, role: UserRole) => {
        const { registrationAttempts } = get();
        const now = Date.now();
        
        // Clean up old attempts
        const validAttempts = registrationAttempts.filter(
          attempt => (now - attempt.timestamp) < (TIME_WINDOW_MINUTES * 60 * 1000)
        );

        if (validAttempts.length >= MAX_REGISTRATION_ATTEMPTS) {
          throw new Error(`Limite de registros excedido. Tente novamente em ${TIME_WINDOW_MINUTES} minutos.`);
        }

        const user: User = {
          id: Date.now().toString(),
          name,
          email,
          role
        };

        localStorage.setItem(`user_${email}`, JSON.stringify(user));
        set({
          user,
          isAuthenticated: true,
          registrationAttempts: [...validAttempts, { timestamp: now, ip: 'client' }]
        });
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