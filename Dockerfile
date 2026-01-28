FROM node:24-alpine
WORKDIR /app

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

COPY . .
RUN npm ci

ARG THEME

ENV THEME=${THEME}
ENV NODE_ENV=production

# @related: GITHUB_SHA_ENV_VAR
ARG GITHUB_SHA
ENV GITHUB_SHA=${GITHUB_SHA}

# Generate tsconfig.json from template with the selected THEME
RUN node -e "\
const fs=require('fs');\
const tpl=fs.readFileSync('tsconfig.base.json','utf8');\
fs.writeFileSync('tsconfig.json', tpl.replace(/__THEME__/g, process.env.THEME));\
"
# Build Next.js
RUN npm run build

# Copy static files into standalone directory
RUN cp -r public .next/standalone/public
RUN cp -r .next/static .next/standalone/.next/static

# Set ownership and switch to non-root user
RUN chown -R nextjs:nodejs .next/standalone
USER nextjs

EXPOSE 8080
CMD ["sh", "-c", "HOSTNAME=0.0.0.0 PORT=8080 node .next/standalone/server.js"]

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"
