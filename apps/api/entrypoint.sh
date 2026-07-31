#!/bin/sh
set -e

echo "==> Running Prisma migrations..."
./node_modules/.bin/prisma migrate deploy --schema=./prisma/schema.prisma

echo "==> Seeding database (skip if already seeded)..."
node prisma/seed.js || echo "Seed skipped (may already exist)"

echo "==> Starting NestJS API..."
exec "$@"
