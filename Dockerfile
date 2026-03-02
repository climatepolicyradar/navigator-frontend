FROM node:24-alpine AS builder
WORKDIR /app

COPY . .
RUN npm ci

ARG THEME
ENV THEME=${THEME}
ENV NODE_ENV=production

# @related: GITHUB_SHA_ENV_VAR
ARG GITHUB_SHA
ENV GITHUB_SHA=${GITHUB_SHA}

# Generate tsconfig.json from template with the selected THEME
RUN sed "s/__THEME__/${THEME}/g" tsconfig.base.json > tsconfig.json

RUN npm run build
RUN cp -r public .next/standalone/public
RUN cp -r .next/static .next/standalone/.next/static

# Slim runner: Alpine + Node from apk (no npm; smaller than node:24-alpine).
# For Node 24 use edge; stable (e.g. 3.20) may ship Node 20.
FROM alpine:3.20
RUN apk add --no-cache nodejs
WORKDIR /app

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
COPY --from=builder /app/.next/standalone ./
RUN chown -R nextjs:nodejs .

USER nextjs
# Do not set HOSTNAME here; Next.js uses it as bind address. If set to a URL at runtime the server fails.
ARG PORT=8080
ENV PORT=${PORT}
EXPOSE ${PORT}
CMD ["node", "server.js"]

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:${PORT}', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"
