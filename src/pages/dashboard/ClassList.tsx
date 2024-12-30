import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Users, Search, Trash2 } from 'lucide-react';
import { useClassStore } from '../../store/useClassStore';
import { useAuthStore } from '../../store/useAuthStore';
import { DeleteConfirmationModal } from '../../components/modals/DeleteConfirmationModal';

export const ClassList: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { classes, removeClass } = useClassStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [classToDelete, setClassToDelete] = useState<string | null>(null);

  const userClasses = useClassStore((state) => 
    state.getClassesByUser(user?.id || '', user?.role || '')
  );

  const filteredClasses = userClasses.filter((classItem) =>
    classItem.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClass = (classId: string) => {
    removeClass(classId);
    setClassToDelete(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Turmas
        </h1>
        {user?.role === 'COORDINATOR' && (
          <button
            onClick={() => navigate('/dashboard/nova-turma')}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <PlusCircle className="h-5 w-5" />
            <span>Nova Turma</span>
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar turma..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
            />
          </div>
        </div>

        <div className="p-4">
          {filteredClasses.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">
              Nenhuma turma encontrada.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClasses.map((classItem) => (
                <div
                  key={classItem.id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => navigate(`/dashboard/turma/${classItem.id}`)}
                    >
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {classItem.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {classItem.grade}
                      </p>
                    </div>
                    {user?.role === 'COORDINATOR' && (
                      <button
                        onClick={() => setClassToDelete(classItem.id)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={!!classToDelete}
        onClose={() => setClassToDelete(null)}
        onConfirm={() => handleDeleteClass(classToDelete!)}
        title="Excluir Turma"
        message="Tem certeza que deseja excluir esta turma? Esta ação não pode ser desfeita."
      />
    </div>
  );
};