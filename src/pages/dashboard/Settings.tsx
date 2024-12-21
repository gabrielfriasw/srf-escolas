import React, { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { Moon, Sun, Image, MessageCircle } from 'lucide-react';

export const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [logoUrl, setLogoUrl] = useState(localStorage.getItem('customLogo') || '');
  const [newLogoUrl, setNewLogoUrl] = useState('');

  const handleLogoChange = () => {
    if (newLogoUrl) {
      localStorage.setItem('customLogo', newLogoUrl);
      setLogoUrl(newLogoUrl);
      setNewLogoUrl('');
    }
  };

  const handleContact = () => {
    window.open('https://wa.me/5543996548541', '_blank');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Configurações
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Aparência
          </h2>
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

        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Personalização
          </h2>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-4">
            <div className="flex items-center space-x-4">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo atual" className="h-12 w-12 object-contain" />
              ) : (
                <Image className="h-12 w-12 text-gray-400" />
              )}
              <div className="flex-1">
                <input
                  type="text"
                  value={newLogoUrl}
                  onChange={(e) => setNewLogoUrl(e.target.value)}
                  placeholder="URL da nova logo"
                  className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800"
                />
              </div>
              <button
                onClick={handleLogoChange}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Alterar
              </button>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Suporte
          </h2>
          <button
            onClick={handleContact}
            className="w-full flex items-center justify-center space-x-2 p-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <MessageCircle className="h-5 w-5" />
            <span>Contato via WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};