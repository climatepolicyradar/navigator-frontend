FROM --platform=linux/amd64 node:24-alpine AS builder
WORKDIR /app

COPY . .
RUN npm ci
# scripts/upload-source-maps.sh below needs bash; Alpine's default /bin/sh (busybox ash) doesn't support it.
RUN apk add --no-cache bash

ARG THEME
ENV THEME=${THEME}
ENV NODE_ENV=production

# @related: GITHUB_SHA_ENV_VAR
ARG GITHUB_SHA
ENV GITHUB_SHA=${GITHUB_SHA}
# Client-side alias of GITHUB_SHA; also used as the Faro source map bundleId so
# uploaded maps match the app.version reported at runtime.
ENV NEXT_PUBLIC_GITHUB_SHA=${GITHUB_SHA}

# Must be set at build time: standalone output serialises next.config.js into
# the build, so the assetPrefix ternary never sees runtime env.
ARG NEXT_STATIC_ENABLED
ENV NEXT_STATIC_ENABLED=${NEXT_STATIC_ENABLED}

# Faro environment tag; NEXT_PUBLIC_ vars are inlined into the client bundle at build time
ARG NEXT_PUBLIC_FARO_ENVIRONMENT
ENV NEXT_PUBLIC_FARO_ENVIRONMENT=${NEXT_PUBLIC_FARO_ENVIRONMENT}

# This theme's Faro app collector URL (infra/resources/faro_app.py), read from
# the Pulumi stack output by the deploy workflows before this build runs.
ARG NEXT_PUBLIC_FARO_URL
ENV NEXT_PUBLIC_FARO_URL=${NEXT_PUBLIC_FARO_URL}

# Faro source map upload credentials, consumed by scripts/upload-source-maps.sh
# below; not required for local/dev builds (upload is skipped if unset).
ARG FARO_SOURCEMAP_API_KEY
ENV FARO_SOURCEMAP_API_KEY=${FARO_SOURCEMAP_API_KEY}
ARG FARO_SOURCEMAP_APP_ID
ENV FARO_SOURCEMAP_APP_ID=${FARO_SOURCEMAP_APP_ID}
ARG FARO_SOURCEMAP_STACK_ID
ENV FARO_SOURCEMAP_STACK_ID=${FARO_SOURCEMAP_STACK_ID}

# Generate tsconfig.json from template with the selected THEME
RUN sed "s/__THEME__/${THEME}/g" tsconfig.base.json > tsconfig.json

RUN npm run build
# Must run before the .next/static copy below: uploads then deletes the maps
# productionBrowserSourceMaps emitted, so the image never serves them publicly.
RUN ./scripts/upload-source-maps.sh .next/static "${THEME}-frontend" "${GITHUB_SHA}"
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

# Force Next.js standalone to bind to 0.0.0.0 inside the container, regardless of
# any HOSTNAME the platform sets. Some platforms (including App Runner) set
# HOSTNAME to an internal host name, which Next uses as its bind address,
# breaking TCP health checks that probe 127.0.0.1:PORT.
ARG PORT=8080
ENV PORT=${PORT}
EXPOSE ${PORT}
CMD ["sh", "-c", "HOSTNAME=0.0.0.0 node server.js"]

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:${PORT}', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"
