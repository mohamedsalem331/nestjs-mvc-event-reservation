FROM node:alpine As development

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

RUN npm ci

COPY . .

RUN npm run build

FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

RUN npm prune --production

COPY . .

COPY --from=development /usr/src/app/dist ./dist


CMD ["node", "dist/apps/reservations/main"]