# Sistema de Registro de Frequência

## Novas Funcionalidades
- Sistema de estatísticas por turma
- Envio automático de faltas via WhatsApp
- Registro histórico de presenças
- Exportação de relatórios em PDF

## Configuração do WhatsApp
O sistema agora suporta envio automático de faltas via WhatsApp. Para configurar:
1. Acesse a página da turma
2. Adicione o número do WhatsApp do pedagogo/responsável
3. O número deve estar no formato internacional (ex: 5511999999999)

## Estatísticas
- Visualização de presenças e faltas por período
- Gráficos de distribuição
- Relatórios exportáveis
- Histórico completo por aluno

# Sistema de Gestão Escolar

Sistema web para gestão de turmas, alunos e sessões de prova, com foco em praticidade e comunicação via WhatsApp.

## Funcionalidades

### 1. Gestão de Turmas
- Cadastro e edição de turmas regulares
- Lista de alunos por turma
- Layout visual da sala de aula com posições dos alunos
- Exportação do layout da sala como imagem
- Registro de chamada (Presente/Falta)
- Envio da lista de faltas via WhatsApp

### 2. Gestão de Alunos
- Cadastro e edição de alunos
- Vínculo com turma regular
- Número de chamada
- Dados de contato

### 3. Sessões de Prova
- Criação de sessões de prova
- Alocação automática ou manual de alunos
- Layout visual do ensalamento
- Exportação do layout como imagem
- Registro de presença na prova
- Envio da lista de faltas via WhatsApp

### 4. Comunicação via WhatsApp
- Configuração do número do WhatsApp do professor
- Templates personalizáveis de mensagem
- Envio de lista de faltas para turmas regulares
- Envio de lista de faltas para sessões de prova

### 5. Estatísticas
- Visualização de estatísticas de presença por turma
- Filtros por período
- Exportação de relatórios em PDF

## Requisitos

- Node.js 18+
- PostgreSQL (via Supabase)
- Navegador moderno com suporte a ES6+

## Instalação

1. Clone o repositório
```bash
git clone [url-do-repositorio]
cd [nome-do-projeto]
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

## Tecnologias Utilizadas

- React
- TypeScript
- Tailwind CSS
- Supabase (Banco de dados e Autenticação)
- Vite (Build e Development)

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
