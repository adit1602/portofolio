# ─── Stage 1: Builder ───────────────────────────────────────────────────────
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate

WORKDIR /app

# Copy workspace config files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./

# Copy packages (shared types/config needed for build)
COPY packages/ ./packages/

# Copy API source
COPY apps/api/ ./apps/api/

# Install all dependencies (including devDeps for building)
RUN pnpm install --frozen-lockfile

# Generate Prisma client
RUN pnpm --filter=@portfolio/api exec prisma generate

# Build the API
RUN pnpm --filter=@portfolio/api run build

# Prune to production deps only
RUN pnpm --filter=@portfolio/api --prod deploy /app/pruned

# Copy generated prisma client into pruned output
RUN cp -r apps/api/node_modules/.prisma /app/pruned/node_modules/.prisma || true

# ─── Stage 2: Runner ────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

RUN apk add --no-cache dumb-init

WORKDIR /app

# Copy pruned production deps
COPY --from=builder /app/pruned/node_modules ./node_modules

# Copy built dist
COPY --from=builder /app/apps/api/dist ./dist

# Copy prisma schema & migrations (needed for migrate deploy at startup)
COPY --from=builder /app/apps/api/prisma ./prisma

# Copy Prisma client binaries
COPY --from=builder /app/apps/api/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/apps/api/node_modules/@prisma ./node_modules/@prisma

# Create uploads directory
RUN mkdir -p /app/uploads

# Run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

# Copy entrypoint script
COPY --chown=appuser:appgroup entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 3001

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "/app/entrypoint.sh"]
CMD ["node", "dist/main"]
