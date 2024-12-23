import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClassStore } from '../store/useClassStore';
import { useAuthStore } from '../store/useAuthStore';

export const MonitorInvite: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const acceptMonitorInvite = useClassStore((state) => state.acceptMonitorInvite);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    if (isAuthenticated && user?.role === 'STUDENT_MONITOR') {
      handleAcceptInvite();
    }
  }, [token, isAuthenticated, user]);

  const handleAcceptInvite = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      await acceptMonitorInvite(token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Convite para Monitor
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Para aceitar o convite, você precisa fazer login ou criar uma conta como monitor.
          </p>
          <button
            onClick={() => navigate(`/login?redirect=/monitor-invite/${token}`)}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Fazer Login
          </button>
        </div>
      </div>
    );
  }

  if (user?.role !== 'STUDENT_MONITOR') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Acesso Negado
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Apenas usuários com papel de monitor podem aceitar convites.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Voltar para o Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {loading ? 'Processando...' : 'Convite para Monitor'}
        </h2>
        {error ? (
          <>
            <p className="text-red-600 dark:text-red-400 mb-6">{error}</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Voltar para o Dashboard
            </button>
          </>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">
            {loading ? 'Processando seu convite...' : 'Redirecionando...'}
          </p>
        )}
      </div>
    </div>
  );
};