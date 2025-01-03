import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Menu } from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    // Aplica o fundo escuro no container principal
    <div className="flex h-screen bg-gray-50 dark:bg-dark-primary">
      {/* Backdrop do menu mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Menu lateral */}
      <div
        className={`fixed lg:static inset-y-0 left-0 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-200 ease-in-out z-30 lg:z-0`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-dark-100 border-b border-gray-200 dark:border-dark-300 flex items-center px-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-200 lg:hidden"
          >
            <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </button>
        </header>
        
        {/* Área principal */}
        <main className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-dark-primary">
          <Outlet />
        </main>
      </div>
    </div>
  );
};