FROM node:24-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN corepack enable
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn prisma generate

RUN yarn build


FROM node:24-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package.json yarn.lock ./

RUN corepack enable
RUN yarn install --frozen-lockfile --production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

COPY docker-entrypoint.sh .

RUN chmod +x docker-entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["./docker-entrypoint.sh"]