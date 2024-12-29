import React, { useState } from 'react';
import { X } from 'lucide-react';

interface TeacherInputProps {
  teacherEmails: string[];
  onAddTeacher: (email: string) => void;
  onRemoveTeacher: (email: string) => void;
  error: string;
}

export const TeacherInput: React.FC<TeacherInputProps> = ({
  teacherEmails,
  onAddTeacher,
  onRemoveTeacher,
  error
}) => {
  const [currentEmail, setCurrentEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentEmail.trim()) {
      onAddTeacher(currentEmail.trim());
      setCurrentEmail('');
    }
  };

  return (
    <div>
      <label htmlFor="teacherEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Adicionar Professor
      </label>
      <form onSubmit={handleSubmit} className="mt-1 flex gap-2">
        <input
          type="email"
          id="teacherEmail"
          value={currentEmail}
          onChange={(e) => setCurrentEmail(e.target.value)}
          placeholder="Email do professor"
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Adicionar
        </button>
      </form>

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {teacherEmails.length > 0 && (
        <div className="mt-2 space-y-2">
          {teacherEmails.map((email) => (
            <div
              key={email}
              className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md"
            >
              <span className="text-sm text-gray-600 dark:text-gray-300">{email}</span>
              <button
                type="button"
                onClick={() => onRemoveTeacher(email)}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};