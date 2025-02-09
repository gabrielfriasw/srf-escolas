/*
  # Sistema de Ensalamento
  
  1. Novas Tabelas
    - exam_rooms: Configuração das salas de prova
    - exam_sessions: Sessões de prova
    - exam_allocations: Alocação dos alunos nas salas
    
  2. Relacionamentos
    - exam_rooms -> exam_sessions (1:N)
    - exam_sessions -> exam_allocations (1:N)
    - students -> exam_allocations (1:N)
    
  3. Segurança
    - RLS habilitado em todas as tabelas
    - Políticas de acesso baseadas no proprietário
*/

-- Criar tabela de salas de prova
CREATE TABLE exam_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  capacity integer NOT NULL CHECK (capacity > 0),
  layout jsonb, -- Configuração do layout da sala
  owner_id uuid REFERENCES profiles(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Criar tabela de sessões de prova
CREATE TABLE exam_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  date date NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  owner_id uuid REFERENCES profiles(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Criar tabela de alocação de alunos
CREATE TABLE exam_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_session_id uuid REFERENCES exam_sessions(id) ON DELETE CASCADE NOT NULL,
  exam_room_id uuid REFERENCES exam_rooms(id) ON DELETE CASCADE NOT NULL,
  student_id uuid REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  position_x float,
  position_y float,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_student_per_session UNIQUE (exam_session_id, student_id)
);

-- Habilitar RLS
ALTER TABLE exam_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_allocations ENABLE ROW LEVEL SECURITY;

-- Políticas para exam_rooms
CREATE POLICY "Exam rooms are viewable by everyone"
ON exam_rooms FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Exam rooms can be managed by owner"
ON exam_rooms FOR ALL
TO authenticated
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

-- Políticas para exam_sessions
CREATE POLICY "Exam sessions are viewable by everyone"
ON exam_sessions FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Exam sessions can be managed by owner"
ON exam_sessions FOR ALL
TO authenticated
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

-- Políticas para exam_allocations
CREATE POLICY "Exam allocations are viewable by everyone"
ON exam_allocations FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Exam allocations can be managed by session owner"
ON exam_allocations FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM exam_sessions
    WHERE exam_sessions.id = exam_allocations.exam_session_id
    AND exam_sessions.owner_id = auth.uid()
  )
);