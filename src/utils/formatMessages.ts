import { formatDateBR } from './dateFormat';
import { Student } from '../types';

export const formatIncidentMessage = (
  className: string,
  studentName: string,
  type: string,
  date: string,
  description: string
) => {
  const formattedDate = new Date(date).toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return [
    'REGISTRO DE OCORRÊNCIA',
    '-------------------',
    `Turma: ${className}`,
    `Aluno: ${studentName}`,
    `Data: ${formattedDate}`,
    `Tipo: ${type}`,
    '',
    'Descrição:',
    description,
    '-------------------',
    'Sistema de Registro de Faltas'
  ].join('\n');
};

export const formatAttendanceMessage = (
  className: string,
  absentStudents: Array<{ name: string; number: number }>,
  date: Date
) => {
  const formattedDate = date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const header = [
    'REGISTRO DE FREQUÊNCIA',
    '-------------------',
    `Turma: ${className}`,
    `Data: ${formattedDate}`,
    ''
  ];

  const attendanceInfo = absentStudents.length === 0
    ? ['Todos os alunos compareceram hoje! 🎉']
    : [
        'ALUNOS AUSENTES:',
        ...absentStudents.map(student => `${student.number}. ${student.name}`),
        '',
        `Total de Faltas: ${absentStudents.length}`
      ];

  const footer = [
    '-------------------',
    'SRF - Sistema de Registro de Faltas'
  ];

  return [...header, ...attendanceInfo, ...footer].join('\n');
};