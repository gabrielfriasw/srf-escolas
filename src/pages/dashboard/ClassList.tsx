import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Users, Search, Trash2 } from 'lucide-react';
import { useClassStore } from '../../store/useClassStore';
import { useAuthStore } from '../../store/useAuthStore';
import { DeleteConfirmationModal } from '../../components/modals/DeleteConfirmationModal';

export const ClassList: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { classes, removeClass, fetchClasses } = useClassStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [classToDelete, setClassToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const filteredClasses = classes.filter((classItem) =>
    classItem.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClass = async (classId: string) => {
    try {
      await removeClass(classId);
      setClassToDelete(null);
    } catch (error) {
      console.error('Erro ao excluir turma:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Minhas Turmas
        </h1>
        <button
          onClick={() => navigate('/dashboard/nova-turma')}
          className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900"
        >
          <PlusCircle className="h-5 w-5" />
          <span>Nova Turma</span>
        </button>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Buscar turma..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-black dark:focus:border-gray-500 focus:ring-0"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((classItem) => (
          <div
            key={classItem.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {classItem.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {classItem.grade}
                </p>
              </div>
              {classItem.owner_id === user?.id && (
                <button
                  onClick={() => setClassToDelete(classItem.id)}
                  className="text-red-600 hover:text-red-700 dark:text-red-400"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
              <Users className="h-4 w-4 mr-2" />
              <span>{classItem.students?.length || 0} alunos</span>
            </div>

            <button
              onClick={() => navigate(`/dashboard/turma/${classItem.id}`)}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Acessar
            </button>
          </div>
        ))}
      </div>

      <DeleteConfirmationModal
        isOpen={!!classToDelete}
        onClose={() => setClassToDelete(null)}
        onConfirm={() => classToDelete && handleDeleteClass(classToDelete)}
        title="Excluir Turma"
        message="Tem certeza que deseja excluir esta turma? Esta ação não pode ser desfeita."
      />
    </div>
  );
};