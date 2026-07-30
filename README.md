# DevFlow

A developer collaboration platform with projects, issues, sprints, kanban boards, chat, wiki, and more.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** SQLite (via Prisma ORM)
- **Auth:** NextAuth v5 (credentials, Google OAuth, magic link)
- **UI:** Tailwind CSS v4, Radix UI primitives, Lucide icons
- **State:** TanStack Query, Zustand
- **Real-time:** Socket.IO
- **Testing:** Vitest, Playwright

## Prerequisites

- Node.js 20+
- pnpm

## Getting Started

```bash
# Clone the repository
git clone <repo-url>
cd devflow

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Generate Prisma client and push schema
pnpm db:generate
pnpm db:push

# Seed the database (optional)
pnpm db:seed

# Start the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `DATABASE_URL` | SQLite database path | Yes |
| `AUTH_SECRET` | Auth encryption secret | Yes |
| `AUTH_URL` | App base URL (e.g. `http://localhost:3000`) | Yes |
| `AUTH_GOOGLE_ID` | Google OAuth client ID | No |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret | No |
| `AUTH_GITHUB_ID` | GitHub OAuth App ID | No |
| `AUTH_GITHUB_SECRET` | GitHub OAuth App secret | No |
| `AUTH_RESEND_KEY` | Resend API key for email auth | No |
| `AUTH_EMAIL_FROM` | From address for auth emails | No |
| `STORAGE_ENDPOINT` | S3-compatible storage endpoint | No |
| `STOR_REGION` | Storage region | No |
| `STORAGE_ACCESS_KEY` | Storage access key | No |
| `STORAGE_SECRET_KEY` | Storage secret key | No |
| `STORAGE_BUCKET` | Storage bucket name | No |
| `REDIS_URL` | Redis connection string | No |

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run tests (watch mode) |
| `pnpm test:run` | Run tests once |
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:push` | Push schema to database |
| `pnpm db:studio` | Open Prisma Studio |
| `pnpm db:seed` | Seed database |
| `pnpm test:e2e` | Run Playwright E2E tests |
