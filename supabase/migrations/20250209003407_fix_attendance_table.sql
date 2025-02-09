-- Renomear a tabela attendance para attendance_records
alter table if exists attendance rename to attendance_records;

-- Garantir que a tabela existe com a estrutura correta
create table if not exists attendance_records (
    id uuid default uuid_generate_v4() primary key,
    class_id uuid references classes(id) on delete cascade,
    student_id uuid references students(id) on delete cascade,
    date date not null,
    status varchar(1) not null check (status in ('P', 'F')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(class_id, student_id, date)
);

-- Recriar políticas de segurança
drop policy if exists "Usuários autenticados podem ver registros de presença das suas turmas" on attendance_records;
drop policy if exists "Usuários autenticados podem criar registros de presença nas suas turmas" on attendance_records;
drop policy if exists "Usuários autenticados podem atualizar registros de presença das suas turmas" on attendance_records;

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

-- Habilitar RLS
alter table attendance_records enable row level security;
