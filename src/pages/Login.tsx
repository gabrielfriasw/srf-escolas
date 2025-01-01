import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { School } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { UserRole } from '../types';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('TEACHER');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, register } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegister) {
        await register(name, email, password, role);
      } else {
        await login(email, password);
      }
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-black text-white p-8 rounded-t-3xl">
          <School className="h-8 w-8 mb-6" />
          <h2 className="text-2xl font-medium mb-2">
            {isRegister ? 'Cadastro' : 'Entrar'}
          </h2>
          <p className="text-gray-400 text-sm">
            {isRegister ? 'Crie sua conta' : 'Bem-vindo de volta'}
          </p>
        </div>

        <div className="bg-white p-8 rounded-b-3xl shadow-xl">
          {error && (
            <div className="mb-4 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nome completo"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 text-sm transition-colors"
                    required
                  />
                </div>

                <div>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 text-sm transition-colors"
                  >
                    <option value="COORDINATOR">Coordenador</option>
                    <option value="TEACHER">Professor</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 text-sm transition-colors"
                required
              />
            </div>

            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 text-sm transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-900 transition-all transform hover:scale-[1.02] active:scale-[0.98] duration-200"
            >
              {isRegister ? 'Cadastrar' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              className="text-sm text-gray-600 hover:text-black transition-colors"
            >
              {isRegister
                ? 'Já tem uma conta? Entre'
                : 'Não tem uma conta? Cadastre-se'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};