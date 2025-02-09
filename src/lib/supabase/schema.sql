-- Enable RLS
alter table public.classes enable row level security;
alter table public.students enable row level security;
alter table public.exam_sessions enable row level security;
alter table public.exam_allocations enable row level security;
alter table public.attendance enable row level security;
alter table public.seating_arrangements enable row level security;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.exam_seating cascade;
DROP TABLE IF EXISTS public.exam_attendance cascade;
DROP TABLE IF EXISTS public.exam_allocations cascade;
DROP TABLE IF EXISTS public.exam_sessions cascade;

-- Create exam_sessions table
CREATE TABLE public.exam_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed')),
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Create exam_allocations table
CREATE TABLE public.exam_allocations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    exam_session_id UUID NOT NULL REFERENCES public.exam_sessions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    original_class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    UNIQUE(exam_session_id, student_id)
);

-- Create exam_attendance table
CREATE TABLE public.exam_attendance (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    exam_session_id UUID NOT NULL REFERENCES public.exam_sessions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late')),
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    UNIQUE(exam_session_id, student_id, date)
);

-- Create exam_seating table
CREATE TABLE public.exam_seating (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    exam_session_id UUID NOT NULL REFERENCES public.exam_sessions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    position_x INTEGER NOT NULL,
    position_y INTEGER NOT NULL,
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    UNIQUE(exam_session_id, student_id),
    UNIQUE(exam_session_id, position_x, position_y)
);

-- Create RLS policies
ALTER TABLE public.exam_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.exam_sessions
    FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.exam_sessions
    FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Enable update for owner" ON public.exam_sessions
    FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Enable delete for owner" ON public.exam_sessions
    FOR DELETE USING (auth.uid() = owner_id);

ALTER TABLE public.exam_allocations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.exam_allocations
    FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.exam_allocations
    FOR INSERT WITH CHECK (EXISTS (
        SELECT 1 FROM public.exam_sessions WHERE id = exam_session_id AND owner_id = auth.uid()
    ));
CREATE POLICY "Enable update for session owner" ON public.exam_allocations
    FOR UPDATE USING (EXISTS (
        SELECT 1 FROM public.exam_sessions WHERE id = exam_session_id AND owner_id = auth.uid()
    ));
CREATE POLICY "Enable delete for session owner" ON public.exam_allocations
    FOR DELETE USING (EXISTS (
        SELECT 1 FROM public.exam_sessions WHERE id = exam_session_id AND owner_id = auth.uid()
    ));

ALTER TABLE public.exam_attendance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.exam_attendance
    FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.exam_attendance
    FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Enable update for owner" ON public.exam_attendance
    FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Enable delete for owner" ON public.exam_attendance
    FOR DELETE USING (auth.uid() = owner_id);

ALTER TABLE public.exam_seating ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.exam_seating
    FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.exam_seating
    FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Enable update for owner" ON public.exam_seating
    FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Enable delete for owner" ON public.exam_seating
    FOR DELETE USING (auth.uid() = owner_id);

-- Create functions
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers
create trigger handle_updated_at
  before update on public.exam_sessions
  for each row
  execute function public.handle_updated_at();

create trigger handle_updated_at
  before update on public.exam_allocations
  for each row
  execute function public.handle_updated_at();

create trigger handle_updated_at
  before update on public.exam_attendance
  for each row
  execute function public.handle_updated_at();

create trigger handle_updated_at
  before update on public.exam_seating
  for each row
  execute function public.handle_updated_at();
