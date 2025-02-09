# Guia para Desenvolvedores

Este documento descreve a estrutura do projeto e fornece informações importantes para novos desenvolvedores.

## Estrutura de Diretórios

```
src/
├── components/        # Componentes React reutilizáveis
│   ├── ui/           # Componentes de UI básicos
│   ├── class/        # Componentes relacionados a turmas
│   ├── student/      # Componentes relacionados a alunos
│   ├── attendance/   # Componentes de registro de presença
│   └── modals/       # Modais reutilizáveis
├── config/           # Arquivos de configuração
├── hooks/            # Custom hooks React
├── lib/             # Bibliotecas e utilitários
│   └── supabase/    # Configuração e tipos do Supabase
├── pages/           # Páginas da aplicação
│   └── dashboard/   # Páginas do dashboard
├── store/           # Gerenciamento de estado global
├── types/           # Definições de tipos TypeScript
└── utils/           # Funções utilitárias
```

## Principais Arquivos e suas Funções

### Componentes (`/components`)

- `ClassroomLayout.tsx`: Layout visual da sala com posições dos alunos
- `AttendanceList.tsx`: Lista de chamada com botões P/F
- `ClassHeader.tsx`: Cabeçalho das páginas de turma
- `ui/*.tsx`: Componentes base como Button, Input, etc.

### Hooks (`/hooks`)

- `useClassDetails.ts`: Gerencia dados e ações de uma turma
- `useExamSession.ts`: Gerencia dados e ações de uma sessão de prova
- `useExportLayout.ts`: Exportação do layout como imagem
- `useStats.ts`: Cálculo e gerenciamento de estatísticas

### Store (`/store`)

- `useClassStore.ts`: Estado global das turmas
- `useStudentStore.ts`: Estado global dos alunos
- `useAttendanceStore.ts`: Estado global das presenças
- `useAuthStore.ts`: Estado de autenticação

### Páginas (`/pages`)

- `dashboard/ClassDetails.tsx`: Página de detalhes da turma
- `dashboard/exam/ExamSessionDetails.tsx`: Página de sessão de prova
- `dashboard/exam/NewExamSession.tsx`: Criação de nova sessão

### Configuração (`/config`)

- `whatsapp.ts`: Templates de mensagem do WhatsApp
- `supabase.ts`: Configuração do cliente Supabase

## Padrões e Convenções

### Nomenclatura

- **Componentes**: PascalCase (ex: `ClassHeader.tsx`)
- **Hooks**: camelCase com prefixo "use" (ex: `useClassDetails.ts`)
- **Utilitários**: camelCase (ex: `formatDate.ts`)
- **Tipos**: PascalCase com sufixo descritivo (ex: `ClassData`, `StudentResponse`)

### Estrutura de Componentes

```typescript
// Imports
import React from 'react';
import { ComponentProps } from './types';

// Interface
interface Props {
  // props...
}

// Componente
export const Component: React.FC<Props> = ({ prop1, prop2 }) => {
  // hooks...
  
  // handlers...
  
  return (
    // JSX...
  );
};
```

### Hooks Customizados

```typescript
export const useHook = (params) => {
  // state...
  
  // effects...
  
  // handlers...
  
  return {
    // valores e funções expostos...
  };
};
```

## Banco de Dados

### Tabelas Principais

- `classes`: Turmas regulares
- `students`: Alunos
- `exam_sessions`: Sessões de prova
- `exam_allocations`: Alocações de alunos em provas
- `attendance`: Registro de presença em turmas
- `exam_attendance`: Registro de presença em provas

### Relacionamentos

```
classes
  └── students (1:N)
  └── attendance (1:N)
  
exam_sessions
  └── exam_allocations (1:N)
  └── exam_attendance (1:N)
  
students
  └── exam_allocations (1:N)
  └── attendance (1:N)
  └── exam_attendance (1:N)
```

## Fluxos Comuns

### Registro de Presença

1. Professor acessa página da turma
2. Marca presenças na lista ou no layout
3. Sistema atualiza estado local
4. Professor pode enviar lista via WhatsApp
5. Sistema salva presenças no banco

### Criação de Sessão de Prova

1. Professor acessa "Nova Sessão"
2. Preenche dados básicos
3. Sistema sugere alocação automática
4. Professor ajusta posições se necessário
5. Sistema salva sessão e alocações

## Dicas de Desenvolvimento

1. Use os hooks existentes para lógica comum
2. Mantenha componentes pequenos e focados
3. Siga o padrão de tipos do TypeScript
4. Use os componentes UI base para consistência
5. Documente mudanças importantes

## Processo de Deploy

1. Teste todas as mudanças localmente
2. Atualize a documentação se necessário
3. Faça commit seguindo padrão convencional
4. Push para a branch principal
5. CI/CD fará o deploy automático

## Suporte

Para dúvidas ou problemas:
1. Consulte esta documentação
2. Verifique os comentários no código
3. Abra uma issue no repositório
4. Contate a equipe de desenvolvimento

# Contribuindo com o Projeto

## Novas Áreas para Contribuição
- Módulo de Estatísticas
  - Implementação de novos tipos de gráficos
  - Melhorias na exportação de PDF
  - Customização de períodos de análise

- Sistema de Mensagens
  - Templates personalizados para WhatsApp
  - Suporte a múltiplos idiomas
  - Integração com outros sistemas de mensagem

## Padrões de Código
- Use TypeScript para novas implementações
- Mantenha a tipagem forte
- Documente novas funcionalidades
