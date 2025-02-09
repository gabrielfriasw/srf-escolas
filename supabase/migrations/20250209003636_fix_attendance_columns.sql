-- Remover tabela antiga se existir
drop table if exists attendance_records;

-- Criar nova tabela com estrutura correta
create table attendance_records (
    id uuid default uuid_generate_v4() primary key,
    class_id uuid references classes(id) on delete cascade not null,
    student_id uuid references students(id) on delete cascade not null,
    date date not null,
    status varchar(1) not null check (status in ('P', 'F')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(class_id, student_id, date)
);

-- Habilitar RLS
alter table attendance_records enable row level security;

-- Criar políticas de acesso
create policy "Usuários autenticados podem ver registros de presença das suas turmas"
    on attendance_records for select
    using (
        auth.uid() in (
            select owner_id from classes where id = class_id
        )
    );

create policy "Usuários autenticados podem criar registros de presença nas suas turmas"
    on attendance_records for insert
    with check (
        auth.uid() in (
            select owner_id from classes where id = class_id
        )
    );

create policy "Usuários autenticados podem atualizar registros de presença das suas turmas"
    on attendance_records for update
    using (
        auth.uid() in (
            select owner_id from classes where id = class_id
        )
    );
