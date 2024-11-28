import db from '../schema';
import type { User, RegistrationFormData } from '../../types/user';
import { generateId } from '../utils';

export const userRepository = {
  async create(data: RegistrationFormData): Promise<User> {
    const id = generateId();
    const now = new Date().toISOString();
    
    const user: User = {
      id,
      ...data,
      status: 'pending',
      role: 'user',
      createdAt: now
    };

    await db.execute({
      sql: `INSERT INTO users (
        id, firstName, lastName, organizationalUnit, voivodeship,
        county, commune, address, phone, email, password,
        status, role, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        user.id, user.firstName, user.lastName, user.organizationalUnit,
        user.voivodeship, user.county, user.commune, user.address,
        user.phone, user.email, user.password, user.status,
        user.role, user.createdAt
      ]
    });

    return user;
  },

  async findByEmail(email: string): Promise<User | null> {
    const result = await db.execute({
      sql: 'SELECT * FROM users WHERE email = ?',
      args: [email]
    });

    return result.rows[0] as User || null;
  },

  async findById(id: string): Promise<User | null> {
    const result = await db.execute({
      sql: 'SELECT * FROM users WHERE id = ?',
      args: [id]
    });

    return result.rows[0] as User || null;
  },

  async updateRole(userId: string, newRole: string): Promise<void> {
    await db.execute({
      sql: 'UPDATE users SET role = ? WHERE id = ?',
      args: [newRole, userId]
    });
  },

  async updateStatus(userId: string, newStatus: string): Promise<void> {
    await db.execute({
      sql: 'UPDATE users SET status = ? WHERE id = ?',
      args: [newStatus, userId]
    });
  },

  async getAll(): Promise<User[]> {
    const result = await db.execute('SELECT * FROM users');
    return result.rows as User[];
  }
};