# Besoia MVP Pilot

A throwaway mobile web pilot: two people register, answer seven questions, swap a QR code, and receive a shared compatibility result.

## Structure

- `frontend/` React + Vite + Tailwind single-page app
- `backend/` the only backend; Express MVC API, session identity, matching, events, and CSV export
- `shared/` cross-app constants and scoring contract

### Backend MVC

- `backend/server.js` starts the API server
- `backend/src/app.js` configures middleware and mounts routes
- `backend/src/config/` PostgreSQL connection, migration, schema, and static content
- `backend/src/controllers/` request handling and persistence orchestration
- `backend/src/routes/` API route definitions
- `backend/src/middleware/` cookie session middleware
- `backend/src/utils/` deterministic scoring engine

There is no second `server/` backend. All backend commands run from the `backend` workspace.

## Local setup

1. Copy `backend/.env.example` to `backend/.env` and set `DATABASE_URL`.
2. Start PostgreSQL with `docker compose up -d postgres`.
3. Install dependencies with `npm install`.
4. Apply the schema with `npm run db:migrate`.
5. Start both apps with `npm run dev`.

Implementation work is pushed incrementally to the `development` branch. The `main` branch keeps the agreed project baseline.

The API listens on `http://localhost:3000`; Vite serves the client on `http://localhost:5173`.

## Testing on a phone

1. Connect the phone to the same Wi-Fi as your computer.
2. Run `npm run dev:mobile` instead of `npm run dev`.
3. On the phone, open the **Network** URL Vite prints (e.g. `https://192.168.1.20:5173`).
4. The certificate is self-signed, so accept the warning once (Chrome: *Advanced → Proceed*; Safari: *Show Details → visit this website*).

HTTPS is required because phone browsers only allow camera access on secure pages. If the phone can't connect, allow Node.js through Windows Firewall for private networks.

## API

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/register` | Create or rename the cookie session (`{ name }`) |
| `GET` | `/api/session` | Reconnect: current session and whether the quiz is complete (`{ session: null }` if none) |
| `DELETE` | `/api/session` | Clear the session cookie ("Start fresh") |
| `GET` | `/api/quiz/questions` | The seven questions |
| `POST` | `/api/quiz/answers` | Save all seven answers |
| `POST` | `/api/matches/scan` | Scanner creates a match from the other person's session ID |
| `GET` | `/api/matches/pending` | Latest match for this session; the QR owner polls this |
| `POST` | `/api/events` | Log `qr_generated` |
| `GET` | `/api/events/export.csv` | Export all events as CSV |

Match responses include `score`, `icebreaker`, `friend`, and `sharedAnswers` (the questions both people answered the same way), so both phones render an identical result.
