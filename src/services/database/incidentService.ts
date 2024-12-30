import { createConnection } from '../../config/database';
import { Incident } from '../../types';
import { v4 as uuidv4 } from 'uuid';

export const incidentService = {
  async getStudentIncidents(studentId: string): Promise<Incident[]> {
    const conn = await createConnection();
    try {
      const [incidents]: any = await conn.execute(
        'SELECT * FROM incidents WHERE student_id = ? ORDER BY date DESC',
        [studentId]
      );
      
      return incidents.map((incident: any) => ({
        id: incident.id,
        studentId: incident.student_id,
        type: incident.type,
        date: incident.date,
        description: incident.description
      }));
    } finally {
      await conn.end();
    }
  },

  async addIncident(incident: Omit<Incident, 'id'>): Promise<Incident> {
    const conn = await createConnection();
    try {
      const id = uuidv4();
      await conn.execute(
        'INSERT INTO incidents (id, student_id, type, date, description) VALUES (?, ?, ?, ?, ?)',
        [id, incident.studentId, incident.type, incident.date, incident.description]
      );

      return { ...incident, id };
    } finally {
      await conn.end();
    }
  }
};