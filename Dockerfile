# Base image
FROM node:24-alpine

# Set working directory
WORKDIR /app

# Install netcat for checking DB readiness (optional but helpful)
RUN apk add --no-cache netcat-openbsd

# Copy package.json and lock file
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy rest of the app
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the app (for production)
RUN npm run build

# Expose the app port
EXPOSE 8000

# Set environment variable to production
ENV NODE_ENV=production

# Final command to wait for DB, run migration, then start the app
CMD sh -c "
  echo '⏳ Waiting for DB...';
  until nc -z \$DB_HOST \$DB_PORT; do sleep 1; done;
  echo '✅ DB is ready';
  npx prisma migrate deploy &&
  node dist/main
"
