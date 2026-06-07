# Minimal Issue Management Platform

A full-stack issue management system to create issues, manage discussions, and generate AI-based analysis using Gemini.


## Features

- Create and manage issues
- View issue list and issue details
- Add discussions per issue
- Update issue status
- Generate AI analysis (Gemini) based on issue + discussion history
- User switching system (no authentication, simulated users from database)


## Tech Stack

**Frontend**
- Next.js (App Router)
- TypeScript
- Tailwind CSS

**Backend**
- Node.js (Express)
- TypeScript
- Drizzle ORM

**Database**
- PostgreSQL

**AI**
- Google Gemini API



## Architecture Overview

- Frontend communicates with backend via REST APIs
- Server Components fetch issues and details
- Client Components handle interactions (forms, discussions, AI generation)
- Users are fetched from database and selected via UI switcher
- AI analysis is generated on demand and cached in database



## API Endpoints

### Issues
- POST /api/issues → create issue
- GET /api/issues → list issues
- GET /api/issues/:id → issue details
- PATCH /api/issues/:id/status → update status

### Discussions
- POST /api/discussions → add comment
- GET /api/discussions/issue/:issueId → list discussions

### Users
- GET /api/users → list users

### AI
- POST /api/ai/analyze/:issueId → generate or fetch cached analysis


## Setup Instructions

### 1. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Environment variables

**Backend** (`backend/.env`):

```env
DATABASE_URL=postgresql://user:password@localhost:5432/issue_management
PORT=3001
GEMINI_API_KEY=your_gemini_api_key
```

**Frontend** (`frontend/.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 3. Run migrations and seed

```bash
cd backend
npx drizzle-kit migrate
npm run seed
```

Re-run `npm run seed` after any database reset.

### 4. Start servers

```bash
# Backend (port 3001)
cd backend && npm run dev

# Frontend (port 3000)
cd frontend && npm run dev
```

### 5. Render deployment (backend)

Render sets `NODE_ENV=production`, so a plain `npm install` skips `devDependencies`. TypeScript and `@types/*` are in `devDependencies` and are required to compile.

**Render build command:**

```bash
npm run deploy:build
```

**Render start command:**

```bash
npm start
```

`deploy:build` installs dev dependencies, runs `tsc`, then prunes dev packages so production `node_modules` stays lean.

## Seed Data

| Data | Source |
|------|--------|
| Users (6 demo accounts) | `npm run seed` |
| Issues | Created via UI |
| Discussions | Posted on issue detail pages |
| AI analyses | Generated on demand |

## Data Fetching & Caching

| Layer | Caching behavior |
|-------|------------------|
| **Frontend GET requests** | `cache: "no-store"` on all reads — always fresh data from API |
| **Frontend mutations** | POST/PATCH never cached |
| **Next.js Router** | `router.refresh()` revalidates Server Components after issue creation |
| **Client state** | No SWR/React Query; local React state only |
| **Backend AI** | Analysis cached in `ai_analyses` table (DB persistence, not HTTP cache) |
| **Backend API responses** | No HTTP cache headers; stateless per request |

All frontend HTTP calls use native `fetch` via a single module (`frontend/src/services/api.ts`). Axios is not used.

## Known Limitations

- No authentication — user identity is client-selected via switcher
- AI analysis is cached in DB and not invalidated when discussions change
- AI panel does not auto-load cached analysis on page visit (manual trigger only)
- Discussions API returns 404 for empty threads — frontend normalizes to `[]`
- `imageUrl` is supported by API but not exposed in the create-issue form

## Project Structure

```
Issue_management_platform/
├── backend/src/modules/   # issues, discussions, users, ai
├── backend/drizzle/       # SQL migrations
└── frontend/src/
    ├── app/               # Next.js pages
    ├── components/        # UI components
    ├── contexts/          # Active user context
    ├── hooks/             # useAiAnalysis
    ├── lib/               # formatters, user helpers
    ├── services/api.ts    # Single HTTP client (fetch)
    └── types/             # TypeScript types
```