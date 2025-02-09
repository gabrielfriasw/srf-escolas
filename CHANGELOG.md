# Changelog

## [1.0.10] - 2025-02-09

### Added
- Sistema de Ensalamentos (Classroom Allocation System)
  - Implementação do sistema de alocação de salas de aula
  - Gerenciamento de turmas e horários
  - Interface para professores e coordenadores

### Changed
- Melhorias no sistema de presença (Attendance System)
  - Nova política unificada de segurança para registros de presença
  - Otimização da estrutura da tabela de presença
  - Validação aprimorada para evitar registros duplicados

### Enhanced
- Perfis de Usuário
  - Adição do campo WhatsApp para contato
  - Melhor gerenciamento de papéis (COORDINATOR/TEACHER)
  - Atualização automática do campo 'updated_at'

### Fixed
- Correção nas chaves estrangeiras do sistema de exames
  - Melhoria nas relações entre tabelas
  - Implementação de CASCADE em deleções
- Ajustes nas políticas de segurança (Row Level Security)
  - Refinamento das permissões de acesso
  - Melhor controle de dados por usuário

### Security
- Implementação de políticas de segurança mais robustas
- Melhor controle de acesso aos dados do sistema
- Proteção aprimorada para operações CRUD

## [1.1.0] - 2024-02-09
### Adicionado
- Sistema de estatísticas por turma
- Envio automático de faltas via WhatsApp
- Registro histórico de presenças
- Exportação de relatórios em PDF

### Melhorado
- Interface do usuário mais intuitiva
- Performance no carregamento de dados
- Feedback visual nas ações

### Corrigido
- Problemas de exibição no modo escuro
- Bugs na contagem de presenças
- Erros na ordenação de alunos

---
Para mais detalhes sobre as mudanças, consulte os commits individuais no repositório.
