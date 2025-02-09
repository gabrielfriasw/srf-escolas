-- Habilitar RLS para a tabela attendance
alter table attendance enable row level security;

-- Remover políticas existentes
drop policy if exists "Usuários autenticados podem ver registros de presença das suas turmas" on attendance;
drop policy if exists "Usuários autenticados podem criar registros de presença nas suas turmas" on attendance;
drop policy if exists "Usuários autenticados podem atualizar registros de presença das suas turmas" on attendance;

-- Criar política para SELECT
create policy "Usuários autenticados podem ver registros de presença das suas turmas"
    on attendance for select
    using (
        auth.uid() in (
            select owner_id from classes where id = class_id
        )
    );

-- Criar política para INSERT
create policy "Usuários autenticados podem criar registros de presença nas suas turmas"
    on attendance for insert
    with check (
        auth.uid() in (
            select owner_id from classes where id = class_id
        )
    );

-- Criar política para UPDATE
create policy "Usuários autenticados podem atualizar registros de presença das suas turmas"
    on attendance for update
    using (
        auth.uid() in (
            select owner_id from classes where id = class_id
        )
    );

-- Criar política para DELETE
create policy "Usuários autenticados podem deletar registros de presença das suas turmas"
    on attendance for delete
    using (
        auth.uid() in (
            select owner_id from classes where id = class_id
        )
    );

-- Garantir que a tabela existe com a estrutura correta
create table if not exists attendance (
    id uuid default uuid_generate_v4() primary key,
    class_id uuid references classes(id) on delete cascade not null,
    student_id uuid references students(id) on delete cascade not null,
    date date not null,
    status varchar(1) not null check (status in ('P', 'F')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(class_id, student_id, date)
);
