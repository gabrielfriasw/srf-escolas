/*
  # Sistema de Registro de Faltas - Estrutura do Banco de Dados

  1. Tabelas
    - users: Armazena informações dos usuários
    - classes: Armazena as turmas
    - students: Armazena os alunos
    - attendance_records: Registros de presença
    - incidents: Registros de ocorrências
    - student_positions: Posições dos alunos no espelho de classe

  2. Relacionamentos
    - Uma turma tem vários alunos
    - Uma turma tem vários registros de presença
    - Um aluno tem várias ocorrências
    - Um aluno tem uma posição no espelho
*/

-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS srf_database;
USE srf_database;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('COORDINATOR', 'TEACHER') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de turmas
CREATE TABLE IF NOT EXISTS classes (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  grade VARCHAR(50) NOT NULL,
  pedagogist_phone VARCHAR(20) NOT NULL,
  shift ENUM('morning', 'afternoon', 'night') NOT NULL,
  owner_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- Tabela de alunos
CREATE TABLE IF NOT EXISTS students (
  id VARCHAR(36) PRIMARY KEY,
  class_id VARCHAR(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  number INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);

-- Tabela de posições dos alunos no espelho de classe
CREATE TABLE IF NOT EXISTS student_positions (
  student_id VARCHAR(36) PRIMARY KEY,
  position_x FLOAT NOT NULL,
  position_y FLOAT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Tabela de registros de presença
CREATE TABLE IF NOT EXISTS attendance_records (
  id VARCHAR(36) PRIMARY KEY,
  class_id VARCHAR(36) NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);

-- Tabela de faltas dos alunos
CREATE TABLE IF NOT EXISTS student_absences (
  attendance_record_id VARCHAR(36) NOT NULL,
  student_id VARCHAR(36) NOT NULL,
  PRIMARY KEY (attendance_record_id, student_id),
  FOREIGN KEY (attendance_record_id) REFERENCES attendance_records(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Tabela de ocorrências
CREATE TABLE IF NOT EXISTS incidents (
  id VARCHAR(36) PRIMARY KEY,
  student_id VARCHAR(36) NOT NULL,
  type ENUM('Atraso', 'Comportamento Inadequado', 'Elogio', 'Outros') NOT NULL,
  date DATE NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Índices para melhorar a performance
CREATE INDEX idx_class_owner ON classes(owner_id);
CREATE INDEX idx_student_class ON students(class_id);
CREATE INDEX idx_attendance_class ON attendance_records(class_id);
CREATE INDEX idx_incident_student ON incidents(student_id);