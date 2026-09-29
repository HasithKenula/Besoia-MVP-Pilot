# Besoia MVP Pilot

A mobile web pilot for meeting new people. Two people each enter a name, answer seven quick questions, and swap QR codes. Both phones then show the same compatibility result: a score, the answers they share, and an icebreaker to start the conversation.

This is a throwaway pilot, not a production system. It is built for speed of delivery, not scale or long-term maintenance. There is no native app, no install and no login.

## How it works

1. **You.** Enter a first name. The server creates an anonymous session (a UUID in a cookie).
2. **Questions.** Answer seven multiple-choice questions, one per screen.
3. **Connect.** One person shows their QR code, and the other scans it with the camera or uploads a screenshot of it.
4. **Result.** The scanner sees the result immediately. The person showing the code sees the same result a moment later, because their screen polls for new matches.

## Features

- Name-only registration. Returning visitors are recognised and can continue or start fresh.
- A one-question-per-screen quiz with tappable cards, auto-advance, a progress bar, keyboard shortcuts (A–C, arrow keys) and a saved draft.
- A QR code that can be saved as an image, plus a scanner with camera and image-upload modes.
- A result sheet with an animated score ring, the answers both people share, an icebreaker and confetti.
- A connections list: tap someone to see your result with them again.
- An animated landing background: two "people" glows that drift together, react to the mouse, and show your initials as you type.
- Mobile-first layout, tested from 320px phones to tablets and landscape. It supports safe areas and respects "reduce motion".
- Event logging and CSV export for measuring the pilot.

## Tech stack

| Part | Choice |
|---|---|
| Frontend | React 18 + Vite 6 (JavaScript), React Router |
| Styling | Tailwind CSS 3, Fraunces and Inter fonts |
| QR | `qrcode.react` (generate), `html5-qrcode` (scan) |
| Backend | Node.js + Express 4 |
| Database | PostgreSQL 16 |
| Identity | UUID in an `httpOnly` cookie, mirrored in `localStorage` |

## Project structure

```
frontend/   React single-page app            → see frontend/README.md
backend/    Express API, the only backend    → see backend/README.md
shared/     Reserved for cross-app contracts → see shared/README.md
docker-compose.yml   Local PostgreSQL
```

This is an npm workspaces monorepo. Run all commands from the repo root unless noted.

## Getting started

**Requirements:** Node.js 20+ and PostgreSQL 16. Use Docker, or a local install on port 5432.

```bash
# 1. Configure the backend
cp backend/.env.example backend/.env      # then edit DATABASE_URL if needed

# 2. Start PostgreSQL (skip if you run it yourself)
docker compose up -d postgres

# 3. Install dependencies for all workspaces
npm install

# 4. Create the tables
npm run db:migrate

# 5. Start the frontend and backend together
npm run dev
```

Then open **http://localhost:5173**. The API runs on http://localhost:3000, and Vite forwards `/api` requests to it.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Frontend and backend with hot reload |
| `npm run dev:mobile` | Same, but the frontend is served over HTTPS on your Wi-Fi network for phone testing |
| `npm run build` | Production build of the frontend into `frontend/dist` |
| `npm start` | Start the backend only |
| `npm run db:migrate` | Apply `backend/src/config/schema.sql` (safe to re-run) |

### Environment variables (`backend/.env`)

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `3000` | API port |
| `DATABASE_URL` | `postgres://postgres:postgres@localhost:5432/besoia` | PostgreSQL connection |
| `CLIENT_ORIGIN` | `http://localhost:5173` | Allowed CORS origin |
| `NODE_ENV` | — | Set to `production` to mark the session cookie `Secure` |

## Testing on a phone

1. Connect the phone to the same Wi-Fi as your computer.
2. Run `npm run dev:mobile` instead of `npm run dev`.
3. On the phone, open the **Network** URL Vite prints (e.g. `https://192.168.1.20:5173`).
4. The certificate is self-signed, so accept the warning once (Chrome: *Advanced → Proceed*; Safari: *Show Details → visit this website*).

HTTPS is required because phone browsers only allow camera access on secure pages. While `dev:mobile` is running, the app on your computer is at `https://localhost:5173`.

To try a full match, use two phones, or one phone plus a desktop browser in a private window. Each browser gets its own session.

## Scoring and results

- **Score** = the number of questions both people answered identically ÷ 7, as a whole percentage. For example, 4 shared answers gives 57%.
- **Shared answers** are the questions where both people picked the same option.
- **Icebreaker** is picked at random from `backend/src/config/icebreakers.js` when the match is created, and stored with it, so both phones show the same one.

The client supplies the scoring rules and icebreaker content. We implement them but don't design them.

## Metrics

Each of these events is written to the `events` table:

| Event | When |
|---|---|
| `registration` | Someone enters their name |
| `questionnaire_completed` | All seven answers are saved |
| `qr_generated` | Someone opens their QR code |
| `qr_scanned` | Someone scans a code |
| `match_created` | A match is saved (logged against the QR owner) |

Download everything as CSV from **http://localhost:3000/api/events/export.csv**.

## Troubleshooting

| Problem | Fix |
|---|---|
| Vite overlay says ``The `font-display` class does not exist`` | A dev server started before the Tailwind config changed is still running. Stop every `vite` process and run `npm run dev` again. |
| Red underlines on `@tailwind` / `@apply` in VS Code | Install the recommended **Tailwind CSS IntelliSense** extension and reload the window. The workspace settings in `.vscode/` do the rest. |
| Phone can't open the Network URL | Check that both devices use the same Wi-Fi, and allow Node.js through Windows Firewall for private networks. |
| Camera doesn't start on a phone | The page must be HTTPS (use `dev:mobile`) and camera permission must be allowed. Uploading a screenshot of the code always works as a fallback. |
| `/api/health` returns `database: unavailable` | PostgreSQL isn't running or `DATABASE_URL` is wrong. Run `docker compose up -d postgres` and then `npm run db:migrate`. |
| The person showing the QR never sees the result | Keep the **My code** tab open. It checks for new matches every 2.5 seconds while the page is visible. |

## Branches

Work is pushed incrementally to `development`. `main` keeps the agreed project baseline.
