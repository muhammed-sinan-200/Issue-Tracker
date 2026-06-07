# Issue-Tracker Minimal Issue Management Platform

Full-stack issue tracker built for reporting, tracking, and resolving school or facility-related issues. Report school/facility issues, discuss them, update status, and get AI analysis from Gemini.

---

## Live Deployment

| | URL |
|---|-----|
| **Live application** | https://issue-tracker-six-sandy.vercel.app |
| **Frontend** (Vercel) | https://issue-tracker-six-sandy.vercel.app |
| **Backend API** (Render) | https://issue-tracker-ru6o.onrender.com/api |

---

## What it does

Users pick a profile from a switcher (no real auth), create issues, filter them on a dashboard, and open a detail page to post comments, change status, or run AI analysis. The AI reads the issue plus discussion history and returns a summary, severity, fix steps, and justification. Results are cached in the database.

---

## Features

- Landing page, dashboard, create issue form, and issue detail view
- Search and filter by status, priority, and category (client-side on the dashboard)
- Discussions on each issue, tied to the active user
- Status updates: `open` → `in_progress` → `resolved`
- AI analysis via Gemini (`gemini-2.5-flash`), cached in Postgres
- User switcher with roles: `student`, `maintenance_admin`, `school_office`
- Responsive layout (Tailwind)
- Zod validation on the backend; typed API client on the frontend

**Not built:** login/auth

---

## Tech stack

**Frontend:** Next.js 16 (App Router), React, TypeScript, Tailwind CSS  
**Backend:** Node.js, Express, TypeScript, Zod  
**Database:** PostgreSQL, Drizzle ORM  
**AI:** Google Gemini API  
**Hosting:** Vercel (frontend), Render (API + Postgres)

---

## Project structure

```
backend/
├── drizzle/              # migrations
└── src/
    ├── server.ts
    ├── db/               # schema, pool, seed
    └── modules/
        ├── issues/       # routes → controllers → services → validators
        ├── discussions/
        ├── users/
        └── ai/

frontend/src/
├── app/                  # pages (landing + (app) routes)
├── components/
├── contexts/             # ActiveUserContext
├── hooks/                # useAiAnalysis
├── lib/                  # formatters
├── services/api.ts       # all HTTP calls
└── types/
```

Server Components load issues on the dashboard and detail pages. Client components handle forms, discussions, status changes, and the AI panel. Everything goes through one `api.ts` file.

---

## Database

| Table | What it stores |
|-------|----------------|
| `users` | Demo accounts (name, role) |
| `issues` | Title, description, category, status, priority, creator |
| `discussions` | Comments on an issue |
| `ai_analyses` | Cached Gemini output per issue |

```
users → issues → discussions
              → ai_analyses
```

`npm run seed` adds 6 demo users. Issues and discussions are created through the app.

---

## API

Base: `http://localhost:3001/api` (local) · `https://issue-tracker-ru6o.onrender.com/api` (prod)

Responses: `{ success, message, data }`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/issues` | Create issue |
| GET | `/api/issues` | List issues (`?status`, `?priority`, `?category`) |
| GET | `/api/issues/:id` | Issue + creator |
| PATCH | `/api/issues/:id/status` | Update status |
| POST | `/api/discussions` | Add comment |
| GET | `/api/discussions/issue/:issueId` | List comments |
| GET | `/api/users` | List users |
| POST | `/api/ai/analyze/:issueId` | Generate or return cached AI analysis |

---

## Local setup

**Requirements:** Node 20+, PostgreSQL, Gemini API key

```bash
git clone https://github.com/muhammed-sinan-200/Issue-Tracker.git
cd issue-tracker

cd backend && npm install
cd ../frontend && npm install
```

**Backend** — create `backend/.env`:

```env
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/issue_management
GEMINI_API_KEY=gemini_api_key
```

**Frontend** — create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

**Database:**

```bash
cd backend
npx drizzle-kit migrate
npm run seed          # once per fresh DB
```

**Run:**

```bash
cd backend && npm run dev    # :3001
cd frontend && npm run dev   # :3000
```

For hosted Postgres (e.g. Render external URL), add `?sslmode=require` to `DATABASE_URL`.

Copy `backend/.env.example` → `backend/.env` and `frontend/.env.example` → `frontend/.env.local`, then fill in your values.

---

## Required Environment Variables

**Backend** (`backend/.env`) — see `backend/.env.example`

```env
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/issue_management
GEMINI_API_KEY=your_gemini_api_key
CORS_ORIGIN=http://localhost:3000
```

**Frontend** (`frontend/.env.local`) — see `frontend/.env.example`

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

| Variable | Where | Required |
|----------|-------|----------|
| `DATABASE_URL` | Backend | Yes |
| `GEMINI_API_KEY` | Backend | Yes (for AI) |
| `NEXT_PUBLIC_API_URL` | Frontend | Yes |
| `PORT` | Backend | No (default `3001`) |
| `CORS_ORIGIN` | Backend | No |

Production frontend example:

```env
NEXT_PUBLIC_API_URL=https://your-api.onrender.com/api
```

---

## Engineering Decisions

- **Next.js App Router** — server-side data fetching for dashboard/detail pages; client components for forms and interactions
- **PostgreSQL + Drizzle** — relational schema with enums and FKs; SQL-first migrations
- **Modular Express backend** — routes, controllers, services, and validators per domain (`issues`, `discussions`, `users`, `ai`)
- **Single `api.ts` client** — one place for all frontend HTTP calls and error handling
- **No auth** — user switcher over seeded users keeps the challenge scope focused on core workflows

---

## Deployment

**Vercel** (root: `frontend`)

- Build: `npm run build`
- Env: `NEXT_PUBLIC_API_URL=https://issue-tracker-ru6o.onrender.com/api`
- Redeploy after env changes

**Render** (root: `backend`)

- Build: `npm run deploy:build`
- Start: `npm start`
- Env: `DATABASE_URL` (internal URL), `GEMINI_API_KEY`, `NODE_ENV=production`

Run migrations and seed against the external DB URL from your machine before pointing the app at it.

---