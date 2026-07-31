# Portfolio — Agent Conventions

This file captures the conventions, architecture decisions, and scope boundaries for this project.
Any AI agent working on this codebase should read this before writing code.

## Stack

| Layer | Technology | Notes |
|---|---|---|
| Monorepo | pnpm workspaces + Turborepo | Root `turbo.json` defines all tasks |
| Frontend | Next.js 14 (App Router) + TypeScript + Tailwind + shadcn/ui | `apps/web` |
| Backend | NestJS + TypeScript + Prisma ORM | `apps/api` |
| Database | PostgreSQL 16 | Local: Docker Compose |
| Cache | Redis 7 | Local: Docker Compose |
| Auth | JWT (15m access) + httpOnly refresh cookie (30d) + Argon2 | Single admin user |
| CI | GitHub Actions | `.github/workflows/ci.yml` |

## Folder Structure

```
portfolio/
├── apps/
│   ├── api/          # NestJS backend
│   │   ├── src/
│   │   │   ├── auth/
│   │   │   ├── skills/
│   │   │   ├── experiences/
│   │   │   ├── projects/
│   │   │   ├── site-settings/
│   │   │   └── prisma/
│   │   └── prisma/
│   │       ├── schema.prisma
│   │       └── seed.ts
│   └── web/          # Next.js frontend
│       └── src/
│           ├── app/
│           │   ├── (public)/   # portfolio pages
│           │   └── admin/      # admin panel
│           ├── components/
│           │   ├── layout/
│           │   └── sections/
│           ├── lib/
│           └── middleware.ts
├── packages/
│   ├── config/       # Shared ESLint + TypeScript configs
│   ├── types/        # Shared TypeScript types
│   └── ui/           # Shared UI components (Phase 2)
├── docs/
│   └── DESIGN.md     # Original task instructions
├── docker-compose.yml
├── turbo.json
└── pnpm-workspace.yaml
```

## Key Conventions

### API
- All endpoints are prefixed with `/api` (set in `main.ts`)
- Public GET endpoints need no auth
- All mutating endpoints (POST, PATCH, DELETE) require `@UseGuards(JwtAuthGuard)`
- Use `class-validator` DTOs for all request bodies
- PrismaService is global — no need to import PrismaModule in feature modules
- Error handling: throw NestJS built-in exceptions (`NotFoundException`, `ConflictException`, etc.)

### Frontend
- Data fetching is done server-side in page components (no `useEffect` for data)
- Use `Promise.all` for parallel fetches; wrap each in `.catch(() => [])` to fail gracefully
- Admin pages are client components (`'use client'`) that check localStorage for the access token
- Middleware (`src/middleware.ts`) protects `/admin/*` using the httpOnly refresh_token cookie
- CSS: use the custom classes defined in `globals.css` (`.glass-card`, `.gradient-text`, `.btn-primary`, `.badge`, etc.)

### Auth Flow
1. User submits `POST /api/auth/login` with `{ email, password }`
2. API returns `{ accessToken }` in body + sets `refresh_token` httpOnly cookie
3. Frontend stores `accessToken` in localStorage; uses it as `Authorization: Bearer` header
4. Next.js middleware checks for `refresh_token` cookie to gate admin pages
5. When access token expires, call `POST /api/auth/refresh` to get a new one

### Adding New Modules
1. Create `src/<name>/<name>.service.ts`, `.controller.ts`, `.module.ts`
2. Add DTOs in `src/<name>/dto/`
3. Import the new module in `src/app.module.ts`
4. PrismaService is auto-injected — just add it to the constructor

## Scope Boundaries

### Phase 0 + 1 ✅ (complete)
- Monorepo scaffold
- Docker Compose (Postgres + Redis)
- NestJS API with Prisma (Auth, Skills, Experiences, Projects, SiteSettings)
- Next.js frontend (public portfolio + admin login + dashboard shell)
- GitHub Actions CI
- Seed script

### Phase 1.5 ✅ (complete)
- Image upload (local disk storage, `apps/api/uploads/`, served at `/uploads/*`)
  - `POST /api/uploads` (auth-guarded, multipart field `file`) — `apps/api/src/uploads/`
  - Profile photo: stored as `SiteSetting` key `hero_photo_url`, shown in `HeroSection`
  - Project photo: optional `Project.photoUrl` column, shown in `ProjectsSection`

### Phase 2+ ❌ (do not add yet)
- Blog / MDX content
- Cloud/object storage for uploads (S3, Cloudinary) — currently local disk only
- SEO settings panel
- Audit log / version history
- Analytics integration
- Full admin CRUD forms (Skills, Experiences, Projects editors)
- Deployment to hosting platform

## Environment Variables

See `.env.example` for all required variables. Never commit `.env` to git.

## Running Locally

```bash
# 1. Copy env vars
cp .env.example .env

# 2. Start Postgres + Redis
docker compose up -d

# 3. Install dependencies
pnpm install

# 4. Run database migrations
pnpm db:migrate

# 5. Seed the database
pnpm db:seed

# 6. Start all apps
pnpm dev
# API: http://localhost:3001
# Web: http://localhost:3000
```

## CI

```bash
pnpm turbo run lint typecheck test
```
