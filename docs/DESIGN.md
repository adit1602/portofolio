# ROLE & CONTEXT
You are implementing Phase 0 and Phase 1 of a personal portfolio website project
for a backend/DevOps engineer. The full architecture and all design decisions
are defined in `docs/DESIGN.md` in this repo — read it in full before writing
any code. Treat it as the source of truth. Do not deviate from the stack
decisions there. If you think something in it is wrong or there's a better
approach, tell me and ask before overriding it — never silently change the
architecture.

# ARCHITECTURE RECAP (must follow exactly — see docs/DESIGN.md for full detail)
- Monorepo: pnpm workspaces + Turborepo
  - apps/web      → Next.js (App Router), TypeScript, Tailwind, shadcn/ui
  - apps/api      → NestJS, TypeScript, Prisma ORM
  - packages/ui, packages/types, packages/config
- Database: PostgreSQL (local via Docker Compose for now, no cloud DB yet)
- Auth: JWT access token (15m) + refresh token (httpOnly cookie, 30d),
  Argon2 password hashing. Single admin user for now. Include a `role`
  column (admin/editor) in the schema, but do NOT build any permission
  logic beyond "is this user an admin" — no RBAC UI, no multi-role logic.
- No Sanity, no third-party headless CMS, no external auth provider.

# SCOPE OF THIS TASK — PHASE 0 + PHASE 1 ONLY
Explicitly OUT of scope for this task (later phases, do not touch):
blog, media library / image upload, SEO settings, audit log, version
history, analytics integration, any deployment to a hosting platform.

Deliverables:
1. Monorepo scaffold (pnpm + Turborepo) matching the folder structure above.
2. `docker-compose.yml` for local Postgres + Redis.
3. Prisma schema covering ONLY: users, site_settings, social_links,
   skill_categories, skills, experiences, projects, project_skills
   (see docs/DESIGN.md §3.1 for field definitions). Skip every other table.
4. NestJS skeleton:
   - AuthModule: login endpoint, JWT issue + refresh, Argon2 hashing.
   - SkillsModule, ExperiencesModule, ProjectsModule: basic CRUD,
     mutating endpoints protected by a JWT guard.
5. Next.js skeleton:
   - Public routes: Hero, About, Skills, Experience, Featured Projects,
     rendering real data fetched from the API (no hardcoded content).
   - `/admin/login` page + a minimal `/admin/dashboard` shell, protected
     via middleware that checks the JWT.
6. A seed script: creates one admin user from env vars, plus a few sample
   skills/experiences/projects so the site isn't empty.
7. A basic GitHub Actions workflow: install deps, lint, typecheck, test —
   on every push.
8. A root `AGENTS.md` capturing the conventions above (stack choices,
   folder structure, what's in/out of scope) so future tasks stay consistent.

# PROCESS — follow in this order
1. Read `docs/DESIGN.md` in full first.
2. Propose a short implementation plan (file/module list + order of work).
   STOP here and wait for my explicit approval before writing any code.
3. After I approve, implement incrementally with logically scoped commits
   (not one giant commit).
4. Once the app runs, use the browser to actually open http://localhost:3000,
   click through Hero/About/Skills/Projects, then log into /admin/login
   with the seeded admin account. Report what you verified, with a screenshot.
5. Run `pnpm turbo run lint typecheck test` before declaring the task done
   and show me the output.

# CONSTRAINTS
- Keep this task scoped to Phase 0 + Phase 1 only — do not start on Phase 2+
  features even if it seems convenient to add them now.
- Prefer readable, well-commented code over clever code.