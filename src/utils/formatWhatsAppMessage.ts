import { Student } from '../types';

export const formatWhatsAppMessage = (
  className: string,
  absentStudents: Student[],
  date: Date
) => {
  const formattedDate = date.toLocaleDateString('pt-BR');
  
  const absentList = absentStudents
    .map(student => `${student.number}. ${student.name}`)
    .join('\n');

  return encodeURIComponent(
    `*Registro de Faltas - ${className}*\n` +
    `📅 Data: ${formattedDate}\n\n` +
    `*Alunos Ausentes:*\n${absentList}`
  );
};