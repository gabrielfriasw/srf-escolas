import { createConnection } from '../../config/database';
import { Class, Student, Position } from '../../types';
import { v4 as uuidv4 } from 'uuid';

export const classService = {
  async getAllClasses(): Promise<Class[]> {
    const conn = await createConnection();
    try {
      const [classes]: any = await conn.execute('SELECT * FROM classes');
      const [students]: any = await conn.execute('SELECT * FROM students');
      const [positions]: any = await conn.execute('SELECT * FROM student_positions');

      return classes.map((classItem: any) => ({
        ...classItem,
        students: students
          .filter((s: any) => s.class_id === classItem.id)
          .map((student: any) => ({
            ...student,
            position: positions.find((p: any) => p.student_id === student.id)
              ? {
                  x: positions.find((p: any) => p.student_id === student.id).position_x,
                  y: positions.find((p: any) => p.student_id === student.id).position_y
                }
              : undefined
          }))
      }));
    } finally {
      await conn.end();
    }
  },

  async addClass(newClass: Omit<Class, 'id'>): Promise<Class> {
    const conn = await createConnection();
    try {
      const id = uuidv4();
      await conn.execute(
        'INSERT INTO classes (id, name, grade, pedagogist_phone, shift, owner_id) VALUES (?, ?, ?, ?, ?, ?)',
        [id, newClass.name, newClass.grade, newClass.pedagogistPhone, newClass.shift, newClass.ownerId]
      );

      return { ...newClass, id };
    } finally {
      await conn.end();
    }
  },

  async removeClass(id: string): Promise<void> {
    const conn = await createConnection();
    try {
      await conn.execute('DELETE FROM classes WHERE id = ?', [id]);
    } finally {
      await conn.end();
    }
  },

  async updateStudentPositions(classId: string, positions: Record<string, Position>): Promise<void> {
    const conn = await createConnection();
    try {
      await conn.beginTransaction();

      for (const [studentId, position] of Object.entries(positions)) {
        await conn.execute(
          'INSERT INTO student_positions (student_id, position_x, position_y) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE position_x = ?, position_y = ?',
          [studentId, position.x, position.y, position.x, position.y]
        );
      }

      await conn.commit();
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      await conn.end();
    }
  }
};