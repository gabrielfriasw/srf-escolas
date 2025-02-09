-- Reset schema
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('teacher', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

CREATE TABLE public.classes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    grade TEXT NOT NULL,
    pedagogist_phone TEXT NOT NULL,
    shift TEXT NOT NULL CHECK (shift IN ('morning', 'afternoon', 'night')),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    UNIQUE(name, owner_id)
);

CREATE TABLE public.students (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    registration_number TEXT NOT NULL,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    UNIQUE(registration_number, owner_id)
);

CREATE TABLE public.incidents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

CREATE TABLE public.exam_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed')),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

CREATE TABLE public.exam_allocations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    exam_session_id UUID NOT NULL REFERENCES public.exam_sessions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    original_class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    UNIQUE(exam_session_id, student_id)
);

CREATE TABLE public.exam_attendance (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    exam_session_id UUID NOT NULL REFERENCES public.exam_sessions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late')),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    UNIQUE(exam_session_id, student_id, date)
);

CREATE TABLE public.exam_seating (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    exam_session_id UUID NOT NULL REFERENCES public.exam_sessions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    position_x INTEGER NOT NULL,
    position_y INTEGER NOT NULL,
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    UNIQUE(exam_session_id, student_id),
    UNIQUE(exam_session_id, position_x, position_y)
);

-- Create RLS policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read for authenticated users" ON public.profiles
    FOR SELECT TO authenticated
    USING (true);
CREATE POLICY "Enable write for user themselves" ON public.profiles
    FOR ALL TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read for authenticated users" ON public.classes
    FOR SELECT TO authenticated
    USING (true);
CREATE POLICY "Enable write for class owner" ON public.classes
    FOR ALL TO authenticated
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read for authenticated users" ON public.students
    FOR SELECT TO authenticated
    USING (true);
CREATE POLICY "Enable write for class owner" ON public.students
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.classes
            WHERE id = class_id AND owner_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.classes
            WHERE id = class_id AND owner_id = auth.uid()
        )
    );

ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read for authenticated users" ON public.incidents
    FOR SELECT TO authenticated
    USING (true);
CREATE POLICY "Enable write for class owner" ON public.incidents
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.students s
            JOIN public.classes c ON s.class_id = c.id
            WHERE s.id = student_id AND c.owner_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.students s
            JOIN public.classes c ON s.class_id = c.id
            WHERE s.id = student_id AND c.owner_id = auth.uid()
        )
    );

ALTER TABLE public.exam_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read for authenticated users" ON public.exam_sessions
    FOR SELECT TO authenticated
    USING (true);
CREATE POLICY "Enable write for session owner" ON public.exam_sessions
    FOR ALL TO authenticated
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

ALTER TABLE public.exam_allocations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read for authenticated users" ON public.exam_allocations
    FOR SELECT TO authenticated
    USING (true);
CREATE POLICY "Enable write for session owner" ON public.exam_allocations
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.exam_sessions
            WHERE id = exam_session_id AND owner_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.exam_sessions
            WHERE id = exam_session_id AND owner_id = auth.uid()
        )
    );

ALTER TABLE public.exam_attendance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read for authenticated users" ON public.exam_attendance
    FOR SELECT TO authenticated
    USING (true);
CREATE POLICY "Enable write for session owner" ON public.exam_attendance
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.exam_sessions
            WHERE id = exam_session_id AND owner_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.exam_sessions
            WHERE id = exam_session_id AND owner_id = auth.uid()
        )
    );

ALTER TABLE public.exam_seating ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read for authenticated users" ON public.exam_seating
    FOR SELECT TO authenticated
    USING (true);
CREATE POLICY "Enable write for session owner" ON public.exam_seating
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.exam_sessions
            WHERE id = exam_session_id AND owner_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.exam_sessions
            WHERE id = exam_session_id AND owner_id = auth.uid()
        )
    );

-- Create triggers
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.classes
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.students
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.incidents
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.exam_sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.exam_allocations
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.exam_attendance
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.exam_seating
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
