# trunk-ignore-all(trivy/DS002)
# trunk-ignore-all(checkov/CKV_DOCKER_3)
# trunk-ignore-all(trivy/DS026)
# trunk-ignore-all(checkov/CKV_DOCKER_2)
FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:24-alpine AS builder
WORKDIR /app
ARG THEME
ENV THEME=${THEME}
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Generate tsconfig.json from template with the selected THEME
RUN node -e "\
const fs=require('fs');\
const tpl=fs.readFileSync('tsconfig.base.json','utf8');\
fs.writeFileSync('tsconfig.json', tpl.replace(/__THEME__/g, process.env.THEME));\
"
# Build Next.js
RUN npm run build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ARG THEME
ENV THEME=${THEME}
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
# include the generated tsconfig for editor tooling inside container (optional)
COPY --from=builder /app/tsconfig.json ./tsconfig.json
EXPOSE 3000
CMD ["npm", "run", "start"]