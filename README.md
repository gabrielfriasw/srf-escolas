# SRF Escolas

Este é um sistema desenvolvido para facilitar o processo de registro de faltas escolares. A plataforma permite que coordenadores e professores registrem as faltas dos alunos de forma simples e eficiente. O sistema envia automaticamente uma mensagem para o pedagogo responsável via WhatsApp, informando os alunos que faltaram, a sala e o dia da falta. Além disso, oferece funcionalidades para visualizar a quantidade de faltas por aluno em um determinado período e organizar os registros das turmas.

# Funcionalidades: 

- Registro de Faltas: Professores e coordenadores podem registrar as faltas dos alunos de maneira rápida e intuitiva.
- Organização do Espelho da Turma: A plataforma permite que os registros de faltas sejam organizados de acordo com a turma, facilitando o acompanhamento por parte do pedagogo.
- Relatórios de Faltas: É possível visualizar a quantidade de faltas de cada aluno em um período determinado, o que auxilia na gestão escolar.
- Envio Automático de Mensagens: Sempre que uma falta é registrada, o sistema envia automaticamente uma mensagem para o pedagogo responsável via WhatsApp, informando:

1. Alunos que faltaram
2. Sala e turma
3. Data da falta

- Acesso para Diferentes Perfis: O site conta com um sistema de login para que professores, coordenadores e alunos monitores possam acessar funcionalidades específicas de acordo com seu perfil.

# Tecnologias Utilizadas

Frontend:
HTML, CSS (Tailwind) e JavaScript/TypeScript para o desenvolvimento da interface de usuário.
Backend:

Supabase como banco de dados e integração de backend, facilitando a gestão de dados de usuários e registros de faltas.
Envio de Mensagens WhatsApp:

# Autenticação:
Sistema de autenticação integrado para garantir que apenas usuários autorizados (professores, coordenadores, pedagogos e alunos monitores) tenham acesso a funcionalidades específicas.

Se você deseja rodar este projeto localmente, siga os passos abaixo:

1. Clonar o Repositório

 ```git clone https://github.com/maddaxzz/srf-escolas.git ```

2. Instalar Dependências
   
Certifique-se de ter o Node.js instalado. Depois, instale as dependências:

 ```cd srf-escolas ```

 ```npm install ```

3. Configuração do Banco de Dados

O sistema usa o Supabase para integração com o banco de dados. Crie uma conta no Supabase e configure seu projeto. Em seguida, adicione as credenciais no arquivo de configuração.

4. Executar o Projeto
Para rodar o projeto localmente, use:

 ```npm run dev ```
Acesse http://localhost:3000 no seu navegador.

