import React from 'react';
import { Users, Edit, BarChart } from 'lucide-react';
import { Button } from '../ui/Button';

interface ClassHeaderProps {
  name: string;
  grade: string;
  onToggleClassroom: () => void;
  onEdit: () => void;
  onViewStats: () => void;
}

export const ClassHeader: React.FC<ClassHeaderProps> = ({
  name,
  grade,
  onToggleClassroom,
  onEdit,
  onViewStats,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {name}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">{grade}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          onClick={onViewStats}
          variant="primary"
          icon={<BarChart className="h-5 w-5" />}
        >
          Estatísticas
        </Button>

        <Button
          onClick={onEdit}
          variant="primary"
          icon={<Edit className="h-5 w-5" />}
        >
          Editar
        </Button>

        <Button
          onClick={onToggleClassroom}
          variant="secondary"
          icon={<Users className="h-5 w-5" />}
        >
          Espelho de Classe
        </Button>
      </div>
    </div>
  );
};