import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { classService } from '../services/classService';
import { Class } from '../types';

export const useClasses = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    const loadClasses = async () => {
      if (!user) return;
      
      setLoading(true);
      const result = await classService.getClassesForUser(user.id);
      
      if (result.success) {
        setClasses(result.data);
      } else {
        setError(result.error);
      }
      setLoading(false);
    };

    loadClasses();
  }, [user]);

  return { classes, loading, error };
};