import { createConnection } from '../../config/database';
import { User, UserRole } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

export const userService = {
  async login(email: string, password: string): Promise<Omit<User, 'password'>> {
    const conn = await createConnection();
    try {
      const [rows]: any = await conn.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      if (rows.length === 0) {
        throw new Error('Credenciais inválidas');
      }

      const user = rows[0];
      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        throw new Error('Credenciais inválidas');
      }

      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } finally {
      await conn.end();
    }
  },

  async register(
    name: string,
    email: string,
    password: string,
    role: UserRole
  ): Promise<Omit<User, 'password'>> {
    const conn = await createConnection();
    try {
      // Verifica se o email já existe
      const [existing]: any = await conn.execute(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if (existing.length > 0) {
        throw new Error('Email já cadastrado');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const id = uuidv4();

      await conn.execute(
        'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
        [id, name, email, hashedPassword, role]
      );

      return { id, name, email, role };
    } finally {
      await conn.end();
    }
  }
};