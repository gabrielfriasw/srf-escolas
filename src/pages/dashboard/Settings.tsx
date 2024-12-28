import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { Moon, Sun, MessageCircle } from 'lucide-react';

export const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const handleContact = () => {
    window.open('https://wa.me/5543996548541', '_blank');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Configurações
      </h1>

      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Aparência
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Tema Escuro
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Alterne entre os temas claro e escuro
                </p>
              </div>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Suporte
          </h2>
          <button
            onClick={handleContact}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <MessageCircle className="h-5 w-5" />
            <span>Contatar Suporte</span>
          </button>
        </div>
      </div>
    </div>
  );
};