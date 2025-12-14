FROM node:20-alpine
ENV NODE_ENV=development

WORKDIR /app

RUN apk update && apk add --no-cache postgresql-client dos2unix

COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

RUN npm i --legacy-peer-deps

COPY . .

RUN chmod +x db-migrate.sh
