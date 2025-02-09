export const whatsappConfig = {
  // Templates para Turmas Regulares
  regularClass: {
    // Template da mensagem de falta
    // Variáveis disponíveis:
    // - {date}: Data da aula
    // - {className}: Nome da turma
    // - {grade}: Série da turma
    // - {students}: Lista de alunos faltantes
    absenceMessageTemplate: `*Registro de Faltas - {date}*

*Turma:* {className} ({grade})

Alunos faltantes:
{students}

_Mensagem gerada automaticamente pelo sistema._`,

    // Template para cada aluno na lista
    // Variáveis disponíveis:
    // - {number}: Número do aluno
    // - {name}: Nome do aluno
    studentTemplate: '• Nº {number} - {name}',
    
    // Separador entre alunos
    studentSeparator: '\n'
  },

  // Templates para Ensalamento
  examSession: {
    // Template da mensagem de falta
    // Variáveis disponíveis:
    // - {date}: Data da prova
    // - {className}: Nome da turma
    // - {grade}: Série da turma
    // - {location}: Local do ensalamento
    // - {students}: Lista de alunos faltantes
    absenceMessageTemplate: `*Registro de Faltas - Ensalamento {date}*

*Turma:* {className} ({grade})
*Local:* {location}

Alunos faltantes:
{students}

_Mensagem gerada automaticamente pelo sistema._`,

    // Template para cada aluno na lista
    // Variáveis disponíveis:
    // - {number}: Número do aluno
    // - {name}: Nome do aluno
    studentTemplate: '• Nº {number} - {name}',
    
    // Separador entre alunos
    studentSeparator: '\n',

    // Template para espelho de classe
    // Variáveis disponíveis:
    // - {date}: Data da prova
    // - {sessionName}: Nome do ensalamento
    // - {students}: Lista de alunos alocados
    mirrorTemplate: `*Espelho de Classe - {date}*
Local: {sessionName}

Alunos alocados:
{students}

_Esta é uma mensagem automática._`
  }
}
