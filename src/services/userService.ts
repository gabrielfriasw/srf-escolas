import { useAuthStore } from '../store/useAuthStore';

export const userService = {
  getUserByEmail: (email: string) => {
    const users = useAuthStore.getState().users;
    return users.find(user => user.email === email);
  },
};