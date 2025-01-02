export const formatWhatsAppMessage = (
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

  const message = [
    `📚 *REGISTRO DE FALTAS*`,
    `━━━━━━━━━━━━━━━`,
    `🏫 *Turma:* ${className}`,
    `📅 *Data:* ${formattedDate}`,
    ``,
    `👥 *ALUNOS AUSENTES:*`,
    ...absentStudents.map(student => 
      `• ${student.number}. ${student.name}`
    ),
    ``,
    `📝 *Total de Faltas:* ${absentStudents.length}`,
    `━━━━━━━━━━━━━━━`,
    `Sistema de Registro de Faltas`
  ].join('\n');

  return message;
};