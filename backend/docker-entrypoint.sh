#!/bin/sh
set -e

echo "Starting Portfolio Backend..."
echo "Node Environment: $NODE_ENV"

echo "Running database migrations..."
attempts=0
max_attempts="${MIGRATION_MAX_RETRIES:-20}"
retry_delay="${MIGRATION_RETRY_DELAY:-3}"

until npm run migrate:up:prod; do
  attempts=$((attempts + 1))
  if [ "$attempts" -ge "$max_attempts" ]; then
    echo "Migration failed after $max_attempts attempts"
    exit 1
  fi
  echo "Migration attempt $attempts/$max_attempts failed. Retrying in ${retry_delay}s..."
  sleep "$retry_delay"
done

echo "Migrations completed successfully"

echo "Starting Node.js application on port $PORT..."
exec node server.js
