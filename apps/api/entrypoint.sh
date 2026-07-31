#!/bin/sh
set -e

echo "==> Running Prisma migrations..."
npx prisma migrate deploy --schema=./prisma/schema.prisma

echo "==> Seeding database (skip if already seeded)..."
node dist/prisma/seed.js || echo "Seed skipped (may already exist)"

echo "==> Starting NestJS API..."
exec "$@"
