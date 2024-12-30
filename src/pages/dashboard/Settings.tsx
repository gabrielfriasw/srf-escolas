import React, { useState, useRef } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { Moon, Sun, MessageCircle, Upload } from 'lucide-react';

export const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [logoUrl, setLogoUrl] = useState(localStorage.getItem('customLogo') || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleContact = () => {
    window.open('https://wa.me/5543996548541', '_blank');
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        localStorage.setItem('customLogo', base64String);
        setLogoUrl(base64String);
      };
      reader.readAsDataURL(file);
    }
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

            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Logo do Sistema
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Altere a logo exibida no menu lateral
                </p>
              </div>
              
              {logoUrl && (
                <div className="mb-4">
                  <img src={logoUrl} alt="Logo atual" className="h-16 w-16 object-contain" />
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleLogoUpload}
                accept="image/*"
                className="hidden"
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Upload className="h-5 w-5" />
                <span>Upload Nova Logo</span>
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