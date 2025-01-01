export const formatWhatsAppMessage = (
  className: string,
  absentStudents: Array<{ name: string; number: number }>,
  date: Date
) => {
  const formattedDate = date.toLocaleDateString('pt-BR');
  
  const absentList = absentStudents
    .map(student => `${student.number}. ${student.name}`)
    .join('\n');

  const message = 
    `*Registro de Faltas - ${className}*\n` +
    `📅 Data: ${formattedDate}\n\n` +
    `*Alunos Ausentes:*\n${absentList}`;

  return encodeURIComponent(message);
};