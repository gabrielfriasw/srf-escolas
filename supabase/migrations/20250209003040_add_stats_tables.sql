-- Criar tabela de estatísticas da turma
create table if not exists attendance (
    id uuid default uuid_generate_v4() primary key,
    class_id uuid references classes(id) on delete cascade,
    student_id uuid references students(id) on delete cascade,
    date date not null,
    status varchar(1) not null check (status in ('P', 'F')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(class_id, student_id, date)
);

-- Criar tabela de estatísticas dos alunos
create table if not exists class_stats (
    id uuid default uuid_generate_v4() primary key,
    class_id uuid references classes(id) on delete cascade unique,
    total_classes integer not null default 0,
    last_updated timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists student_stats (
    id uuid default uuid_generate_v4() primary key,
    student_id uuid references students(id) on delete cascade,
    class_id uuid references classes(id) on delete cascade,
    absences integer not null default 0,
    absence_dates text[] not null default array[]::text[],
    last_updated timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(student_id, class_id)
);

-- Adicionar políticas de segurança
alter table attendance enable row level security;
alter table class_stats enable row level security;
alter table student_stats enable row level security;

-- Políticas para attendance
create policy "Usuários autenticados podem ver registros de presença das suas turmas"
    on attendance for select
    using (
        auth.uid() in (
            select owner_id from classes where id = class_id
        )
    );

create policy "Usuários autenticados podem criar registros de presença nas suas turmas"
    on attendance for insert
    with check (
        auth.uid() in (
            select owner_id from classes where id = class_id
        )
    );

create policy "Usuários autenticados podem atualizar registros de presença das suas turmas"
    on attendance for update
    using (
        auth.uid() in (
            select owner_id from classes where id = class_id
        )
    );

-- Políticas para class_stats
create policy "Usuários autenticados podem ver estatísticas das suas turmas"
    on class_stats for select
    using (
        auth.uid() in (
            select owner_id from classes where id = class_id
        )
    );

create policy "Usuários autenticados podem criar/atualizar estatísticas das suas turmas"
    on class_stats for all
    using (
        auth.uid() in (
            select owner_id from classes where id = class_id
        )
    );

-- Políticas para student_stats
create policy "Usuários autenticados podem ver estatísticas dos alunos das suas turmas"
    on student_stats for select
    using (
        auth.uid() in (
            select owner_id from classes where id = class_id
        )
    );

create policy "Usuários autenticados podem criar/atualizar estatísticas dos alunos das suas turmas"
    on student_stats for all
    using (
        auth.uid() in (
            select owner_id from classes where id = class_id
        )
    );
