import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Class } from '../../types';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

interface EditClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<Class>) => Promise<void>;
  classData: {
    name: string;
    grade: string;
    pedagogist_phone: string;
    shift: 'morning' | 'afternoon' | 'night';
  };
}

export const EditClassModal: React.FC<EditClassModalProps> = ({
  isOpen,
  onClose,
  onSave,
  classData,
}) => {
  const [formData, setFormData] = useState({
    name: classData.name,
    grade: classData.grade,
    pedagogist_phone: classData.pedagogist_phone,
    shift: classData.shift,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      setError('Erro ao atualizar turma. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
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
            <Input
              label="Nome da Turma"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <Input
              label="Série/Ano"
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              required
            />

            <Select
              label="Turno"
              value={formData.shift}
              onChange={(e) => setFormData({ ...formData, shift: e.target.value as any })}
            >
              <option value="morning">Matutino</option>
              <option value="afternoon">Vespertino</option>
              <option value="night">Noturno</option>
            </Select>

            <Input
              label="WhatsApp do Pedagogo"
              value={formData.pedagogist_phone}
              onChange={(e) => setFormData({ ...formData, pedagogist_phone: e.target.value })}
              placeholder="Ex: 5511999999999"
              required
            />

            <div className="flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};