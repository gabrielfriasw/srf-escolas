import React, { useState } from 'react';
import { useClassStore } from '../../store/useClassStore';
import { Copy } from 'lucide-react';

interface MonitorAssignmentProps {
  classId: string;
}

export const MonitorAssignment: React.FC<MonitorAssignmentProps> = ({ classId }) => {
  const [inviteLink, setInviteLink] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const createMonitorInvite = useClassStore((state) => state.createMonitorInvite);

  const handleCreateInvite = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const link = await createMonitorInvite(classId);
      setInviteLink(link);
      setSuccess('Link de convite gerado com sucesso!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setSuccess('Link copiado para a área de transferência!');
    } catch (err) {
      setError('Erro ao copiar o link');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6 mt-6">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Atribuir Monitor
      </h2>
      
      <div className="space-y-4">
        <button
          onClick={handleCreateInvite}
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Gerando link...' : 'Gerar Link de Convite'}
        </button>

        {inviteLink && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-300 break-all">
                {inviteLink}
              </p>
              <button
                onClick={copyToClipboard}
                className="ml-2 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <Copy className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        {success && (
          <p className="mt-2 text-sm text-green-600 dark:text-green-400">{success}</p>
        )}
      </div>
    </div>
  );
};