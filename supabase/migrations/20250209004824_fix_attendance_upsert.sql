-- Remover RLS temporariamente para ajustar as políticas
alter table attendance disable row level security;

-- Remover todas as políticas existentes
drop policy if exists "Usuários autenticados podem ver registros de presença das suas turmas" on attendance;
drop policy if exists "Usuários autenticados podem criar registros de presença nas suas turmas" on attendance;
drop policy if exists "Usuários autenticados podem atualizar registros de presença das suas turmas" on attendance;
drop policy if exists "Usuários autenticados podem deletar registros de presença das suas turmas" on attendance;

-- Criar uma única política que cubra todas as operações
create policy "Gerenciar registros de presença"
    on attendance
    for all
    using (
        auth.uid() in (
            select owner_id from classes where id = class_id
        )
    )
    with check (
        auth.uid() in (
            select owner_id from classes where id = class_id
        )
    );

-- Habilitar RLS novamente
alter table attendance enable row level security;

-- Garantir que a tabela tem a estrutura correta
create table if not exists attendance (
    id uuid default uuid_generate_v4() primary key,
    class_id uuid references classes(id) on delete cascade not null,
    student_id uuid references students(id) on delete cascade not null,
    date date not null,
    status varchar(1) not null check (status in ('P', 'F')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(class_id, student_id, date)
);

-- Garantir que o usuário autenticado tem acesso
grant all on attendance to authenticated;
