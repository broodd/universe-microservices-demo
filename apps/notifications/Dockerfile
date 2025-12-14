# --- STAGE 1: Builder ---
FROM node:20-alpine AS builder

RUN apk update --no-cache && \
    mkdir /app && \
    chown -R node:node /app

WORKDIR /app

COPY package*.json ./

RUN npm ci --legacy-peer-deps

COPY . .

RUN npx nx build notifications --configuration=production

RUN npm ci --omit=dev --legacy-peer-deps

# --- STAGE 2: Runner ---
FROM node:20-alpine AS runner

ENV NODE_ENV=production
WORKDIR /app

RUN chown -R node:node /app
USER node

COPY --from=builder --chown=node:node /app/node_modules ./node_modules

COPY --from=builder --chown=node:node /app/dist/apps/notifications ./dist
COPY --from=builder --chown=node:node /app/package.json ./package.json
COPY --from=builder --chown=node:node /app/apps/notifications/.env.production ./apps/notifications/.env.production

EXPOSE 8080

CMD ["node", "dist/main.js"]
