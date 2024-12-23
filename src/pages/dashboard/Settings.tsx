import React, { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { Image, MessageCircle, Terminal } from 'lucide-react';
import { DeveloperOptions } from '../../components/developer/DeveloperOptions';
import { ThemeSelector } from '../../components/ThemeSelector';

export const Settings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [logoUrl, setLogoUrl] = useState(localStorage.getItem('customLogo') || '');
  const [newLogoUrl, setNewLogoUrl] = useState('');
  const [showDevOptions, setShowDevOptions] = useState(false);

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
      <h1 className="text-2xl font-bold text-theme-primary">
        Configurações
      </h1>

      <div className="bg-theme-primary rounded-lg shadow p-6 space-y-6">
        <div>
          <h2 className="text-lg font-medium text-theme-primary mb-4">
            Aparência
          </h2>
          <div className="p-4 bg-theme-secondary rounded-lg">
            <ThemeSelector currentTheme={theme} onThemeChange={setTheme} />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium text-theme-primary mb-4">
            Personalização
          </h2>
          <div className="p-4 bg-theme-secondary rounded-lg space-y-4">
            <div className="flex items-center space-x-4">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo atual" className="h-12 w-12 object-contain" />
              ) : (
                <Image className="h-12 w-12 text-theme-secondary" />
              )}
              <div className="flex-1">
                <input
                  type="text"
                  value={newLogoUrl}
                  onChange={(e) => setNewLogoUrl(e.target.value)}
                  placeholder="URL da nova logo"
                  className="w-full p-2 rounded-md border border-theme bg-theme-primary text-theme-primary"
                />
              </div>
              <button
                onClick={handleLogoChange}
                className="px-4 py-2 btn-accent rounded-md"
              >
                Alterar
              </button>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium text-theme-primary mb-4">
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

        <div>
          <button
            onClick={() => setShowDevOptions(!showDevOptions)}
            className="w-full flex items-center justify-center space-x-2 p-4 bg-theme-secondary text-theme-primary rounded-lg hover:opacity-90"
          >
            <Terminal className="h-5 w-5" />
            <span>Opções do Desenvolvedor</span>
          </button>
        </div>
      </div>

      {showDevOptions && <DeveloperOptions />}
    </div>
  );
};