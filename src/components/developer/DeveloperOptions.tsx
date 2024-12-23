import React from 'react';
import { useOfflineStore } from '../../store/useOfflineStore';
import { supabase } from '../../lib/supabase/supabase';

export const DeveloperOptions: React.FC = () => {
  const { isOnline, pendingChanges } = useOfflineStore();
  const [dbStatus, setDbStatus] = React.useState<'checking' | 'connected' | 'error'>('checking');
  const [lastChecked, setLastChecked] = React.useState<Date | null>(null);

  const checkDatabaseConnection = async () => {
    try {
      const { data, error } = await supabase.from('users').select('count').limit(1);
      if (error) throw error;
      setDbStatus('connected');
    } catch (error) {
      setDbStatus('error');
    }
    setLastChecked(new Date());
  };

  React.useEffect(() => {
    checkDatabaseConnection();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          Opções do Desenvolvedor
        </h2>
        <span className="text-xs text-red-600 dark:text-red-400">
          Apenas para desenvolvedores!
        </span>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Status do Sistema
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Conexão com Internet:</span>
              <span className={`text-sm ${isOnline ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Banco de Dados:</span>
              <span className={`text-sm ${
                dbStatus === 'connected' ? 'text-green-600 dark:text-green-400' :
                dbStatus === 'error' ? 'text-red-600 dark:text-red-400' :
                'text-yellow-600 dark:text-yellow-400'
              }`}>
                {dbStatus === 'connected' ? 'Conectado' :
                 dbStatus === 'error' ? 'Erro' : 'Verificando'}
              </span>
            </div>
            {lastChecked && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Última verificação:</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {lastChecked.toLocaleTimeString()}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Alterações Pendentes
          </h3>
          {pendingChanges.length > 0 ? (
            <div className="space-y-2">
              {pendingChanges.map((change) => (
                <div key={change.id} className="text-sm text-gray-600 dark:text-gray-400">
                  {change.type} - {change.action} ({new Date(change.timestamp).toLocaleString()})
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Nenhuma alteração pendente
            </p>
          )}
        </div>

        <button
          onClick={checkDatabaseConnection}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Verificar Conexão
        </button>
      </div>
    </div>
  );
};