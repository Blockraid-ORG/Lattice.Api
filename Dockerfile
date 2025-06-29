# Base image
FROM node:24-alpine

# Set working directory
WORKDIR /app

# Install netcat for DB check
RUN apk add --no-cache netcat-openbsd

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy app source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build NestJS project
RUN npm run build

# Expose port
EXPOSE 8000

# Set env to production
ENV NODE_ENV=production

# Final command: wait for DB, run migration, then start app
CMD ["sh", "-c", "\
  echo '⏳ Waiting for DB...' && \
  until nc -z \"$DB_HOST\" \"$DB_PORT\"; do echo '🔁 Waiting...'; sleep 1; done && \
  echo '✅ DB is ready!' && \
  npx prisma migrate deploy && \
  node dist/main \
"]
