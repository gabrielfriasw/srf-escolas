import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Class } from '../../types';

interface EditClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<Class>) => Promise<void>;
  classData: Class;
}

export const EditClassModal: React.FC<EditClassModalProps> = ({
  isOpen,
  onClose,
  onSave,
  classData,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    pedagogist_phone: '',
    shift: 'morning' as const,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Update form data when classData changes
  useEffect(() => {
    setFormData({
      name: classData.name,
      grade: classData.grade,
      pedagogist_phone: classData.pedagogist_phone,
      shift: classData.shift,
    });
  }, [classData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      setError('Erro ao atualizar turma. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        
        <div className="relative bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Editar Turma
            </h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nome da Turma
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Série/Ano
              </label>
              <input
                type="text"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Turno
              </label>
              <select
                value={formData.shift}
                onChange={(e) => setFormData({ ...formData, shift: e.target.value as 'morning' | 'afternoon' | 'night' })}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700"
              >
                <option value="morning">Matutino</option>
                <option value="afternoon">Vespertino</option>
                <option value="night">Noturno</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                WhatsApp do Pedagogo
              </label>
              <input
                type="tel"
                value={formData.pedagogist_phone}
                onChange={(e) => setFormData({ ...formData, pedagogist_phone: e.target.value })}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700"
                placeholder="Ex: 5511999999999"
                required
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};