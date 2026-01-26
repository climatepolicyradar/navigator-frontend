# trunk-ignore-all(trivy/DS002)
# trunk-ignore-all(checkov/CKV_DOCKER_3)
# trunk-ignore-all(trivy/DS026)
# trunk-ignore-all(checkov/CKV_DOCKER_2)
FROM node:24-alpine
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

EXPOSE 3000
CMD ["sh", "-c", "HOSTNAME=0.0.0.0 PORT=3000 node .next/standalone/server.js"]
