# Base image
FROM node:24-alpine

WORKDIR /app

RUN apk add --no-cache netcat-openbsd

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npx prisma generate

EXPOSE 8000

ENV NODE_ENV=development
CMD ["sh", "-c", "echo '⏳ Waiting for DB...' && until nc -z \"$DB_HOST\" \"$DB_PORT\"; do echo '🔁 Waiting...'; sleep 1; done && echo '✅ DB is ready!' && npm run db:rebuild && npm run start:dev"]