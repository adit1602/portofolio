# ─── Stage 1: Builder ───────────────────────────────────────────────────────
FROM node:20-alpine AS builder

# OpenSSL needed by Prisma engines on Alpine
RUN apk add --no-cache openssl

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate

WORKDIR /app

# Copy workspace config files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./

# Copy packages (shared types/config needed for build)
COPY packages/ ./packages/

# Copy API source
COPY apps/api/ ./apps/api/

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Generate Prisma client for TypeScript types
# pnpm exec runs from the package root (/app/apps/api), so schema path is relative there
RUN cd /app/apps/api && ./node_modules/.bin/prisma generate --schema=./prisma/schema.prisma

# Build the API
RUN pnpm --filter=@portfolio/api run build

# Prune to production deps only (creates flat node_modules in /app/pruned)
RUN pnpm --filter=@portfolio/api --prod deploy /app/pruned

# Re-generate Prisma client in the pruned flat node_modules
# This ensures the correct linux-musl binary is present for the runner image
COPY apps/api/prisma/schema.prisma /app/pruned/prisma/schema.prisma
RUN cd /app/pruned && /app/apps/api/node_modules/.bin/prisma generate --schema=./prisma/schema.prisma

# ─── Stage 2: Runner ────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

# OpenSSL needed at runtime by Prisma query engine
RUN apk add --no-cache openssl dumb-init

WORKDIR /app

# Copy pruned production deps (includes .prisma binaries from generate above)
COPY --from=builder /app/pruned/node_modules ./node_modules

# Copy built dist
COPY --from=builder /app/apps/api/dist ./dist

# Copy prisma schema + migrations (needed for migrate deploy at startup)
COPY --from=builder /app/apps/api/prisma ./prisma

# Create uploads directory
RUN mkdir -p /app/uploads

# Run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

# Copy entrypoint script (path relative to monorepo root build context)
COPY --chown=appuser:appgroup apps/api/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 3001

ENTRYPOINT ["dumb-init", "/app/entrypoint.sh"]
CMD ["node", "dist/main"]
