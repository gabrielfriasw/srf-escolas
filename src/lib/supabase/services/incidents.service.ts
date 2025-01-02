import { supabase } from '../supabase';
import type { Incident } from '../../../types';

export const incidentsService = {
  addIncident: async (incident: Omit<Incident, 'id'>) => {
    const { data, error } = await supabase
      .from('incidents')
      .insert({
        student_id: incident.studentId,
        type: incident.type,
        date: incident.date,
        description: incident.description,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  getStudentIncidents: async (studentId: string) => {
    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .eq('student_id', studentId)
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data;
  },
};