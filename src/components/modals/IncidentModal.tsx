import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Student } from '../../types';
import { formatIncidentMessage } from '../../utils/formatMessages';
import { sendWhatsAppMessage } from '../../utils/whatsapp';

interface IncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  classData: {
    name: string;
    pedagogistPhone: string;
  };
  onSave: (incident: { type: string; date: string; description: string }) => void;
}

export const IncidentModal: React.FC<IncidentModalProps> = ({
  isOpen,
  onClose,
  student,
  classData,
  onSave,
}) => {
  const [type, setType] = useState('Atraso');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save the incident
    await onSave({ type, date, description });
    
    // Format and send WhatsApp message
    const message = formatIncidentMessage(
      classData.name,
      student.name,
      type,
      date,
      description
    );
    
    // Send via WhatsApp
    sendWhatsAppMessage(classData.pedagogistPhone, message);
    
    // Close modal and reset form
    onClose();
    setType('Atraso');
    setDate(new Date().toISOString().split('T')[0]);
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Registrar Ocorrência
            </h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Aluno
              </label>
              <input
                type="text"
                value={student.name}
                disabled
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700"
              >
                <option value="Atraso">Atraso</option>
                <option value="Comportamento Inadequado">Comportamento Inadequado</option>
                <option value="Elogio">Elogio</option>
                <option value="Outros">Outros</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Data
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descrição
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700"
                rows={4}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Enviar Ocorrência
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};