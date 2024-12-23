import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClassStore } from '../../store/useClassStore';
import { useAuthStore } from '../../store/useAuthStore';

export const NewClass: React.FC = () => {
  const navigate = useNavigate();
  const addClass = useClassStore((state) => state.addClass);
  const user = useAuthStore((state) => state.user);
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    pedagogistPhone: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('Você precisa estar logado para criar uma turma.');
      return;
    }

    if (!formData.name.trim() || !formData.grade.trim() || !formData.pedagogistPhone.trim()) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    addClass({
      ...formData,
      students: [],
      ownerId: user.id,
    });
    
    navigate('/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Nova Turma
      </h1>

      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 p-3 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nome da Turma
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        <div>
          <label htmlFor="grade" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Série/Ano
          </label>
          <input
            type="text"
            id="grade"
            value={formData.grade}
            onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        <div>
          <label htmlFor="pedagogistPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            WhatsApp do Pedagogo
          </label>
          <input
            type="tel"
            id="pedagogistPhone"
            value={formData.pedagogistPhone}
            onChange={(e) => setFormData({ ...formData, pedagogistPhone: e.target.value })}
            required
            placeholder="Ex: 5511999999999"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
          >
            Criar Turma
          </button>
        </div>
      </form>
    </div>
  );
};