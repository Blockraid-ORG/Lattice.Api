#!/bin/sh

echo "⏳ Menunggu PostgreSQL di $DB_HOST:$DB_PORT..."

while ! nc -z $DB_HOST $DB_PORT; do
  sleep 1
done

echo "✅ PostgreSQL tersedia, lanjut prisma migrate deploy..."

npx prisma migrate deploy

echo "🚀 Menjalankan aplikasi..."
exec node dist/main