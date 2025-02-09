-- Add explicit foreign key relationships
ALTER TABLE public.exam_allocations 
  DROP CONSTRAINT IF EXISTS exam_allocations_student_id_fkey,
  DROP CONSTRAINT IF EXISTS exam_allocations_original_class_id_fkey,
  ADD CONSTRAINT exam_allocations_student_id_fkey 
    FOREIGN KEY (student_id) 
    REFERENCES public.students(id) 
    ON DELETE CASCADE,
  ADD CONSTRAINT exam_allocations_original_class_id_fkey 
    FOREIGN KEY (original_class_id) 
    REFERENCES public.classes(id) 
    ON DELETE CASCADE;

ALTER TABLE public.exam_attendance 
  DROP CONSTRAINT IF EXISTS exam_attendance_student_id_fkey,
  ADD CONSTRAINT exam_attendance_student_id_fkey 
    FOREIGN KEY (student_id) 
    REFERENCES public.students(id) 
    ON DELETE CASCADE;

ALTER TABLE public.exam_seating 
  DROP CONSTRAINT IF EXISTS exam_seating_student_id_fkey,
  ADD CONSTRAINT exam_seating_student_id_fkey 
    FOREIGN KEY (student_id) 
    REFERENCES public.students(id) 
    ON DELETE CASCADE;

-- Adicionar campo whatsapp_number na tabela profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS whatsapp_number TEXT;

-- Adicionar campos temp_name e temp_number na tabela exam_allocations
ALTER TABLE exam_allocations
ADD COLUMN IF NOT EXISTS temp_name TEXT,
ADD COLUMN IF NOT EXISTS temp_number INTEGER;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
