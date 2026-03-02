FROM --platform=linux/amd64 node:24-alpine AS builder
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

# Runner must match builder Node major version; Next.js standalone built on Node 24
# can crash on Node 20 (Alpine 3.20 apk nodejs). Pin platform for App Runner (x86_64).
FROM --platform=linux/amd64 node:24-alpine
WORKDIR /app

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
COPY --from=builder /app/.next/standalone ./
RUN chown -R nextjs:nodejs .

USER nextjs

# Bind to all interfaces so platform health checks (e.g. App Runner) can reach the server.
# Do not set HOSTNAME to a URL at runtime — Next.js uses it as the bind address.
ENV HOSTNAME=0.0.0.0
ARG PORT=8080
ENV PORT=${PORT}
EXPOSE ${PORT}
CMD ["node", "server.js"]

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:${PORT}', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"
