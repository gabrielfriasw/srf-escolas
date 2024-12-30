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

  // Apenas coordenadores podem excluir turmas
  const canDeleteClass = (classOwnerId: string) => {
    return user?.role === 'COORDINATOR';
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

      {/* Rest of the component remains the same */}
    </div>
  );
};