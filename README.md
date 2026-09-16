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

1. Copy `server/.env.example` to `server/.env` and set `DATABASE_URL`.
2. Create a PostgreSQL database and run `npm run db:migrate`.
3. Install dependencies with `npm install`.
4. Start both apps with `npm run dev`.

The API listens on `http://localhost:3000`; Vite serves the client on `http://localhost:5173`.
