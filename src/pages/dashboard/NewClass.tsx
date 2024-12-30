import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { TeacherInput } from '../../components/teacher/TeacherInput';
import { classService } from '../../services/classService';

export const NewClass: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    pedagogistPhone: '',
    shift: 'morning' as 'morning' | 'afternoon' | 'night'
  });
  const [teacherEmails, setTeacherEmails] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!user) {
        throw new Error('Você precisa estar logado para criar uma turma.');
      }

      if (!formData.name.trim() || !formData.grade.trim() || !formData.pedagogistPhone.trim()) {
        throw new Error('Por favor, preencha todos os campos.');
      }

      if (user.role === 'DIRECTOR' && teacherEmails.length === 0) {
        throw new Error('Por favor, adicione pelo menos um professor à turma.');
      }

      const result = await classService.createClass({
        ...formData,
        students: [],
        ownerId: user.id,
        teacherIds: teacherEmails,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ... rest of the component remains the same, just update the submit button to:
  
  <button
    type="submit"
    disabled={loading}
    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
  >
    {loading ? 'Criando...' : 'Criar Turma'}
  </button>