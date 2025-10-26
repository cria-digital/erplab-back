#!/bin/ash
set -e

echo "========================================"
echo "🚀 Starting ERPLab Backend"
echo "========================================"

# Wait for database
echo "⏳ Waiting for database to be ready..."
MAX_RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if node -e "
        const { Client } = require('pg');
        const client = new Client({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        });
        client.connect()
            .then(() => {
                console.log('✅ Database is ready');
                client.end();
                process.exit(0);
            })
            .catch(err => {
                console.log('Database not ready:', err.message);
                process.exit(1);
            });
    " 2>/dev/null; then
        break
    fi

    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo "⏳ Database not ready yet. Retry $RETRY_COUNT/$MAX_RETRIES..."
    sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo "❌ Database connection failed after $MAX_RETRIES attempts"
    exit 1
fi

# Run migrations
echo "🔄 Running database migrations..."
npm run migration:run

if [ $? -eq 0 ]; then
    echo "✅ Migrations completed successfully"
else
    echo "⚠️  Migration failed, but continuing (may be already applied)"
fi

# Run seeders
echo "🌱 Running database seeders..."
npm run seed

if [ $? -eq 0 ]; then
    echo "✅ Seeders completed successfully"
else
    echo "⚠️  Seeder failed, but continuing"
fi

echo "========================================"
echo "✅ Starting application on port ${PORT:-10016}"
echo "========================================"

exec "$@"
