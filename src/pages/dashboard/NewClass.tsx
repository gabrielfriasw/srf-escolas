import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { School } from 'lucide-react';
import { useClassStore } from '../../store/useClassStore';
import { useAuthStore } from '../../store/useAuthStore';

export const NewClass: React.FC = () => {
  const navigate = useNavigate();
  const addClass = useClassStore((state) => state.addClass);
  const user = useAuthStore((state) => state.user);
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    pedagogist_phone: '',
    shift: 'morning' as const
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.grade.trim() || !formData.pedagogist_phone.trim()) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      await addClass({
        ...formData,
        owner_id: user!.id,
      });
      navigate('/dashboard');
    } catch (err) {
      setError('Erro ao criar turma. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-black dark:bg-dark-100 text-white p-8 rounded-t-3xl">
          <School className="h-8 w-8 mb-6" />
          <h2 className="text-2xl font-medium mb-2">Nova Turma</h2>
          <p className="text-gray-400 text-sm">Crie uma nova turma</p>
        </div>

        <div className="bg-white dark:bg-dark-50 p-8 rounded-b-3xl shadow-xl">
          {error && (
            <div className="mb-4 text-red-600 text-sm bg-red-50 dark:bg-red-900/50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nome da Turma"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-300 focus:border-black dark:focus:border-dark-200 focus:ring-0 text-sm transition-colors"
            />

            <input
              type="text"
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              placeholder="Série/Ano"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-300 focus:border-black dark:focus:border-dark-200 focus:ring-0 text-sm transition-colors"
            />

            <select
              value={formData.shift}
              onChange={(e) => setFormData({ ...formData, shift: e.target.value as 'morning' | 'afternoon' })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-300 focus:border-black dark:focus:border-dark-200 focus:ring-0 text-sm transition-colors"
            >
              <option value="morning">Matutino</option>
              <option value="afternoon">Vespertino</option>
            </select>

            <input
              type="tel"
              value={formData.pedagogist_phone}
              onChange={(e) => setFormData({ ...formData, pedagogist_phone: e.target.value })}
              placeholder="WhatsApp do Pedagogo (Ex: 5511999999999)"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-300 focus:border-black dark:focus:border-dark-200 focus:ring-0 text-sm transition-colors"
            />

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-300 text-sm hover:bg-gray-50 dark:hover:bg-dark-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 rounded-xl bg-black dark:bg-dark-100 text-white text-sm hover:bg-gray-900 dark:hover:bg-dark-200"
              >
                Criar Turma
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};