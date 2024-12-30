import { createConnection } from '../../config/database';
import { AttendanceRecord } from '../../types';
import { v4 as uuidv4 } from 'uuid';

export const attendanceService = {
  async getRecordsByClass(classId: string): Promise<AttendanceRecord[]> {
    const conn = await createConnection();
    try {
      const [records]: any = await conn.execute(
        'SELECT * FROM attendance_records WHERE class_id = ?',
        [classId]
      );
      
      const [absences]: any = await conn.execute(
        'SELECT * FROM student_absences WHERE attendance_record_id IN (?)',
        [records.map((r: any) => r.id)]
      );

      return records.map((record: any) => ({
        id: record.id,
        classId: record.class_id,
        date: record.date,
        absentStudents: absences
          .filter((a: any) => a.attendance_record_id === record.id)
          .map((a: any) => a.student_id)
      }));
    } finally {
      await conn.end();
    }
  },

  async addRecord(record: Omit<AttendanceRecord, 'id'>): Promise<AttendanceRecord> {
    const conn = await createConnection();
    try {
      await conn.beginTransaction();
      
      const id = uuidv4();
      await conn.execute(
        'INSERT INTO attendance_records (id, class_id, date) VALUES (?, ?, ?)',
        [id, record.classId, record.date]
      );

      for (const studentId of record.absentStudents) {
        await conn.execute(
          'INSERT INTO student_absences (attendance_record_id, student_id) VALUES (?, ?)',
          [id, studentId]
        );
      }

      await conn.commit();
      return { ...record, id };
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      await conn.end();
    }
  }
};