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

  return [
    'REGISTRO DE FALTAS',
    '-------------------',
    `Turma: ${className}`,
    `Data: ${formattedDate}`,
    '',
    'ALUNOS AUSENTES:',
    ...absentStudents.map(student => `${student.number}. ${student.name}`),
    '',
    `Total de Faltas: ${absentStudents.length}`,
    '-------------------',
    'SRF - Sistema de Registro de Faltas'
  ].join('\n');
};