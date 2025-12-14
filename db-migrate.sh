#!/bin/sh

echo "Waiting for Postgres to be ready for migration..."

/usr/bin/timeout 60 sh -c 'while ! pg_isready -h postgres -U user -d test; do sleep 1; done'

if [ $? -ne 0 ]; then
  echo "Postgres connection failed. Cannot proceed with migrations."
  exit 1
fi

echo "Postgres is up. Starting Drizzle migrations..."

npm run db:migrate

echo "Migrations completed successfully."
