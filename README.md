# Besoia MVP Pilot

A throwaway mobile web pilot: two people register, answer seven questions, swap a QR code, and receive a shared compatibility result.

## Structure

- `client/` React + Vite + Tailwind single-page app
- `besoia-backend/` Express MVC API, session identity, matching, events, and CSV export
- `besoia-backend/src/config/` PostgreSQL connection and static pilot content
- `besoia-backend/src/controllers/` request handling and persistence orchestration
- `besoia-backend/src/routes/` API route definitions
- `besoia-backend/src/utils/` deterministic scoring engine
- `shared/` cross-app constants and scoring contract

## Local setup

1. Copy `besoia-backend/.env.example` to `besoia-backend/.env` and set `DATABASE_URL`.
2. Start PostgreSQL with `docker compose up -d postgres`.
3. Install dependencies with `npm install`.
4. Apply the schema with `npm run db:migrate`.
5. Start both apps with `npm run dev`.

Implementation work is pushed incrementally to the `development` branch. The `main` branch keeps the agreed project baseline.

The API listens on `http://localhost:3000`; Vite serves the client on `http://localhost:5173`.
