#!/bin/sh
set -e

echo "==> Running Prisma migrations..."
./node_modules/.bin/prisma migrate deploy --schema=./prisma/schema.prisma

if [ "$RUN_SEED" = "true" ]; then
  echo "==> Seeding database (RUN_SEED=true)..."
  node prisma/seed.js || echo "Seed failed"
fi

echo "==> Starting NestJS API..."
exec "$@"
