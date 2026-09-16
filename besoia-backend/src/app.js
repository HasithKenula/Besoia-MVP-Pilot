import cors from 'cors';
import express from 'express';
import { pool } from './config/db.js';

export const app = express();

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.get('/api/health', async (_request, response) => {
  try {
    await pool.query('SELECT 1');
    response.json({ ok: true, database: 'connected' });
  } catch {
    response.status(503).json({ ok: false, database: 'unavailable' });
  }
});
