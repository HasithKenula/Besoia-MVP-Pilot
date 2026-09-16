import { randomUUID } from 'node:crypto';
import { pool } from '../config/db.js';
import { icebreakers } from '../config/icebreakers.js';
import { calculateCompatibility } from '../utils/scoringEngine.js';

async function loadAnswers(sessionId) {
  const { rows } = await pool.query('SELECT question_id, answer FROM answers WHERE session_id = $1', [sessionId]);
  return Object.fromEntries(rows.map((row) => [String(row.question_id), row.answer]));
}

export async function createMatch(request, response) {
  const scannedSessionId = String(request.body?.sessionId || '').trim();
  if (!request.sessionId || !scannedSessionId || request.sessionId === scannedSessionId) return response.status(400).json({ error: 'Two different sessions are required' });

  const firstAnswers = await loadAnswers(scannedSessionId);
  const secondAnswers = await loadAnswers(request.sessionId);
  const score = calculateCompatibility(firstAnswers, secondAnswers);
  if (!score && Object.keys(firstAnswers).length !== 7) return response.status(400).json({ error: 'The QR owner has not completed the questionnaire' });
  if (Object.keys(secondAnswers).length !== 7) return response.status(400).json({ error: 'Complete your questionnaire before scanning' });

  const icebreaker = icebreakers[Math.floor(Math.random() * icebreakers.length)];
  const { rows } = await pool.query(
    'INSERT INTO matches (id, session_a, session_b, score, icebreaker) VALUES ($1, $2, $3, $4, $5) RETURNING id AS "matchId", score, icebreaker',
    [randomUUID(), scannedSessionId, request.sessionId, score, icebreaker]
  );
  await pool.query('INSERT INTO events (session_id, event_type, metadata) VALUES ($1, $2, $3), ($4, $5, $6)', [request.sessionId, 'qr_scanned', JSON.stringify({ scannedSessionId }), scannedSessionId, 'match_created', JSON.stringify({ score })]);
  return response.status(201).json({ match: rows[0] });
}

export async function getPendingMatch(request, response) {
  const { rows } = await pool.query('SELECT id AS "matchId", score, icebreaker FROM matches WHERE session_a = $1 OR session_b = $1 ORDER BY created_at DESC LIMIT 1', [request.sessionId]);
  return response.json({ match: rows[0] || null });
}
