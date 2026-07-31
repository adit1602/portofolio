# ─── Stage 1: Builder ───────────────────────────────────────────────────────
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate

WORKDIR /app

# Copy workspace config files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./

# Copy packages (shared types/config/ui needed for build)
COPY packages/ ./packages/

# Copy Web source
COPY apps/web/ ./apps/web/

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Build Next.js app
# NEXT_PUBLIC_API_URL must be set at build time for static pages
ARG NEXT_PUBLIC_API_URL=http://localhost:3001
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN pnpm --filter=@portfolio/web run build

# ─── Stage 2: Runner ────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

RUN apk add --no-cache dumb-init

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy Next.js standalone output
COPY --from=builder --chown=appuser:appgroup /app/apps/web/.next/standalone ./
COPY --from=builder --chown=appuser:appgroup /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=appuser:appgroup /app/apps/web/public ./apps/web/public

USER appuser

EXPOSE 3000

CMD ["dumb-init", "node", "apps/web/server.js"]
