# Base image
FROM node:24-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy .env

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the app
COPY . .

# Prisma: generate client
RUN npx prisma generate

# Prisma: migrate
RUN npx prisma migrate dev

# Build the app
RUN npm run build

# Expose the app port
EXPOSE 8000

# Run the app
# CMD ["node", "dist/main"]
# CMD npx prisma migrate deploy && node dist/main
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
