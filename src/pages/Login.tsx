import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { School } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { UserRole } from '../types';
import { authService } from '../services/authService';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('TEACHER');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        const user = await authService.register(name, email, password, role);
        setUser(user);
      } else {
        const user = await authService.login(email, password);
        setUser(user);
      }
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Resto do componente permanece igual...
};