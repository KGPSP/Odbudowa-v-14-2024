import db from '../schema';
import type { LogEntry, LogFilter } from '../../types/log';
import { generateId } from '../utils';

export const logRepository = {
  async create(entry: Omit<LogEntry, 'id'>): Promise<LogEntry> {
    const id = generateId();
    const log: LogEntry = {
      id,
      ...entry
    };

    await db.execute({
      sql: `INSERT INTO logs (
        id, timestamp, action, userId, claimId, details
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [
        log.id, log.timestamp, log.action, log.userId,
        log.claimId, JSON.stringify(log.details)
      ]
    });

    return log;
  },

  async getAll(filter?: LogFilter): Promise<LogEntry[]> {
    let sql = 'SELECT * FROM logs';
    const args: any[] = [];
    const conditions: string[] = [];

    if (filter) {
      if (filter.startDate) {
        conditions.push('timestamp >= ?');
        args.push(filter.startDate.toISOString());
      }
      if (filter.endDate) {
        conditions.push('timestamp <= ?');
        args.push(filter.endDate.toISOString());
      }
      if (filter.action) {
        conditions.push('action = ?');
        args.push(filter.action);
      }
      if (filter.userId) {
        conditions.push('userId = ?');
        args.push(filter.userId);
      }
      if (filter.claimId) {
        conditions.push('claimId = ?');
        args.push(filter.claimId);
      }
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY timestamp DESC';

    const result = await db.execute({
      sql,
      args
    });

    return result.rows.map(row => ({
      ...row,
      details: JSON.parse(row.details)
    })) as LogEntry[];
  },

  async getByClaimId(claimId: string): Promise<LogEntry[]> {
    const result = await db.execute({
      sql: 'SELECT * FROM logs WHERE claimId = ? ORDER BY timestamp DESC',
      args: [claimId]
    });

    return result.rows.map(row => ({
      ...row,
      details: JSON.parse(row.details)
    })) as LogEntry[];
  }
};