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

# Generate tsconfig.json from template with the selected THEME
RUN node -e "\
const fs=require('fs');\
const tpl=fs.readFileSync('tsconfig.base.json','utf8');\
fs.writeFileSync('tsconfig.json', tpl.replace(/__THEME__/g, process.env.THEME));\
"
# Build Next.js
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]
