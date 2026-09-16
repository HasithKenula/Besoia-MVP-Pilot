import { randomUUID } from 'node:crypto';
import { pool } from '../config/db.js';
import { ensureSession } from '../middleware/session.js';

export async function register(request, response) {
  const name = String(request.body?.name || '').trim();
  if (!name) return response.status(400).json({ error: 'Name is required' });
  if (name.length > 80) return response.status(400).json({ error: 'Name must be 80 characters or fewer' });

  const sessionId = ensureSession(response, request.sessionId || randomUUID());
  await pool.query(
    'INSERT INTO sessions (id, name) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name',
    [sessionId, name]
  );
  await pool.query(
    'INSERT INTO events (session_id, event_type, metadata) VALUES ($1, $2, $3)',
    [sessionId, 'registration', JSON.stringify({ name })]
  );
  return response.status(201).json({ sessionId, name });
}
