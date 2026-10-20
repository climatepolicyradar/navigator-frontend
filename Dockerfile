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

# NEXT_PUBLIC_ vars are inlined into the client bundle at build time
#
# Client-side alias of GITHUB_SHA; also used as the Faro source map bundleId so
# uploaded maps match the app.version reported at runtime.
ENV NEXT_PUBLIC_GITHUB_SHA=${GITHUB_SHA}

# Must be set at build time: standalone output serialises next.config.js into
# the build, so the assetPrefix ternary never sees runtime env.
ARG NEXT_STATIC_ENABLED
ENV NEXT_STATIC_ENABLED=${NEXT_STATIC_ENABLED}

# Faro environment tag
ARG NEXT_PUBLIC_FARO_ENVIRONMENT
ENV NEXT_PUBLIC_FARO_ENVIRONMENT=${NEXT_PUBLIC_FARO_ENVIRONMENT}

# This theme's Faro app collector URL (infra/resources/faro_app.py), read from
# the Pulumi stack output by the deploy workflows before this build runs.
ARG NEXT_PUBLIC_FARO_URL
ENV NEXT_PUBLIC_FARO_URL=${NEXT_PUBLIC_FARO_URL}

# Base URL search/concepts/passages calls are made against. 
# Defaults to production in application code if unset; review stacks can
# override it to point at a search-api review stack via the /use-search-api 
# PR comment command.
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Generate tsconfig.json from template with the selected THEME
RUN sed "s/__THEME__/${THEME}/g" tsconfig.base.json > tsconfig.json

RUN npm run build
RUN cp -r public .next/standalone/public
# Source maps are uploaded to Faro *after* the deploy
# (.github/actions/upload-source-maps), so unlike before they still exist here.
#
# They must not stay in .next/static: productionBrowserSourceMaps makes Next.js
# serve that directory, so a map left there publishes our TypeScript source,
# and the deploy's `aws s3 sync` of the same directory would push ~4x the size
# of the code into a public bucket.
#
# So they move to /app/sourcemaps: a path Next.js never serves, which the
# deploy `docker cp`s out for the Faro upload and which costs ~12MB in the
# image. @related: FUS-761
RUN cp -r .next/static .next/standalone/.next/static \
	&& (cd .next/standalone/.next/static \
		&& find . -name '*.map' -type f -exec install -D {} /app/sourcemaps/{} \;) \
	&& find .next/standalone/.next/static -name '*.map' -type f -delete

# Runner must match builder Node major version; Next.js standalone built on Node 24
# can crash on Node 20 (Alpine 3.20 apk nodejs). Pin platform for App Runner (x86_64).
FROM --platform=linux/amd64 node:24-alpine
WORKDIR /app

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
COPY --from=builder /app/.next/standalone ./
# Client source maps for the post-deploy Faro upload
# (.github/actions/upload-source-maps). Outside .next/static, so Next.js never
# serves them; the deploy extracts them with `docker cp`. Kept in the image
# rather than a separate build stage because a second `docker build --target`
# does not reliably reuse the first build's cache and rebuilt the whole app.
# @related: FUS-761
COPY --from=builder /app/sourcemaps ./sourcemaps
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
