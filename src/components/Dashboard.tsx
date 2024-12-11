import { useState } from 'react';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { Plus, Trash2, School } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const { user, classrooms, addClassroom, deleteClassroom } = useStore();
  const [newClassroomName, setNewClassroomName] = useState('');
  const [newClassroomPhone, setNewClassroomPhone] = useState('');
  const [rows, setRows] = useState('5');
  const [columns, setColumns] = useState('6');
  const navigate = useNavigate();

  const handleAddClassroom = () => {
    if (newClassroomName && newClassroomPhone) {
      const formattedPhone = newClassroomPhone.replace(/\D/g, '');
      addClassroom({
        id: Date.now().toString(),
        name: newClassroomName,
        pedagoguePhone: formattedPhone,
        students: [],
        rows: Number(rows),
        columns: Number(columns),
      });
      setNewClassroomName('');
      setNewClassroomPhone('');
    }
  };

  const canManageClassrooms = user?.role === 'coordinator' || user?.role === 'teacher';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <School className="h-8 w-8 text-indigo-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Bem-vindo(a), {user?.name}!
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Escolha uma turma para fazer a chamada.
              </p>
            </div>
          </div>
        </div>

        {canManageClassrooms && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Adicionar Nova Turma
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <input
                type="text"
                placeholder="Nome da Turma"
                value={newClassroomName}
                onChange={(e) => setNewClassroomName(e.target.value)}
                className="rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Telefone do Pedagogo (com DDD)"
                value={newClassroomPhone}
                onChange={(e) => setNewClassroomPhone(e.target.value)}
                className="rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <select
                value={rows}
                onChange={(e) => setRows(e.target.value)}
                className="rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1} Fileiras
                  </option>
                ))}
              </select>
              <select
                value={columns}
                onChange={(e) => setColumns(e.target.value)}
                className="rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1} Colunas
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddClassroom}
                className="inline-flex items-center justify-center px-6 py-2 border border-transparent rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                <Plus className="h-5 w-5 mr-2" />
                Adicionar Turma
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classrooms.map((classroom) => (
            <div
              key={classroom.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-200"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {classroom.name}
                </h3>
                {canManageClassrooms && (
                  <button
                    onClick={() => deleteClassroom(classroom.id)}
                    className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900 transition-colors duration-200"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Telefone do Pedagogo: {classroom.pedagoguePhone}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Alunos: {classroom.students.length}
              </p>
              <button
                onClick={() => navigate(`/attendance/${classroom.id}`)}
                className="inline-block w-full text-center px-4 py-2 border border-transparent rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                Fazer Chamada
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}