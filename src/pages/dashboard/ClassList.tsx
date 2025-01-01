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

  const userClasses = classes.filter(
    (classItem) => classItem.ownerId === user?.id || classItem.monitorId === user?.id
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
          Minhas Turmas
        </h1>
        {(user?.role === 'COORDINATOR' || user?.role === 'TEACHER') && (
          <button
            onClick={() => navigate('/dashboard/nova-turma')}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <PlusCircle className="h-5 w-5" />
            <span>Nova Turma</span>
          </button>
        )}
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar turma..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {filteredClasses.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            {searchTerm ? 'Nenhuma turma encontrada' : 'Nenhuma turma cadastrada'}
          </h3>
          {!searchTerm && (user?.role === 'COORDINATOR' || user?.role === 'TEACHER') && (
            <>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Comece criando sua primeira turma para registrar as presenças.
              </p>
              <button
                onClick={() => navigate('/dashboard/nova-turma')}
                className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <PlusCircle className="h-5 w-5" />
                <span>Criar Turma</span>
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredClasses.map((classItem) => (
            <div
              key={classItem.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div
                  className="cursor-pointer flex-1"
                  onClick={() => navigate(`/dashboard/turma/${classItem.id}`)}
                >
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {classItem.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {classItem.grade}
                  </p>
                </div>
                {(user?.role === 'COORDINATOR' || user?.role === 'TEACHER') && classItem.ownerId === user.id && (
                  <button
                    onClick={() => setClassToDelete(classItem.id)}
                    className="text-red-600 hover:text-red-700 p-2"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Users className="h-4 w-4 mr-2" />
                <span>{classItem.students.length} alunos</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {classToDelete && (
        <DeleteConfirmationModal
          isOpen={!!classToDelete}
          onClose={() => setClassToDelete(null)}
          onConfirm={() => handleDeleteClass(classToDelete)}
          title="Excluir Turma"
          message="Tem certeza que deseja excluir esta turma? Esta ação não pode ser desfeita."
        />
      )}
    </div>
  );
};