import React, { useEffect, useState } from 'react';
import { teacherService } from '../../services/teacherService';
import { useNavigate } from 'react-router-dom';

export const TeacherAssignments: React.FC = () => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    const result = await teacherService.getPendingAssignments();
    if (result.success) {
      setAssignments(result.data || []);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleAccept = async (classId: string) => {
    const result = await teacherService.acceptAssignment(classId);
    if (result.success) {
      await loadAssignments();
      navigate(`/dashboard/turma/${classId}`);
    } else {
      setError(result.error);
    }
  };

  const handleReject = async (classId: string) => {
    const result = await teacherService.rejectAssignment(classId);
    if (result.success) {
      await loadAssignments();
    } else {
      setError(result.error);
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (assignments.length === 0) {
    return null;
  }

  return (
    <div className="bg-blue-50 dark:bg-blue-900/50 p-4 rounded-lg mb-6">
      <h2 className="text-lg font-medium text-blue-700 dark:text-blue-300 mb-4">
        Convites Pendentes
      </h2>
      
      {error && (
        <div className="text-red-600 dark:text-red-400 mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {assignments.map((assignment) => (
          <div 
            key={assignment.classes.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm"
          >
            <p className="text-gray-900 dark:text-white font-medium">
              {assignment.classes.name}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              {assignment.classes.grade}
            </p>
            
            <div className="flex space-x-4">
              <button
                onClick={() => handleAccept(assignment.classes.id)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Aceitar
              </button>
              <button
                onClick={() => handleReject(assignment.classes.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Recusar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};