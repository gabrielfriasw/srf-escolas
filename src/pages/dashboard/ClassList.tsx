import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Users, Search } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useClasses } from '../../hooks/useClasses';

export const ClassList: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { classes, loading, error } = useClasses();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClasses = classes.filter((classItem) =>
    classItem.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div className="text-red-600">Erro ao carregar turmas: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {user?.role === 'DIRECTOR' ? 'Todas as Turmas' : 'Minhas Turmas'}
        </h1>
        {(user?.role === 'DIRECTOR' || user?.role === 'COORDINATOR') && (
          <button
            onClick={() => navigate('/dashboard/nova-turma')}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <PlusCircle className="h-5 w-5" />
            <span>Nova Turma</span>
          </button>
        )}
      </div>

      {/* Rest of the component remains the same */}
    </div>
  );
};