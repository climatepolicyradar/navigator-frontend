# trunk-ignore-all(trivy/DS026)
# trunk-ignore-all(checkov/CKV_DOCKER_2)
FROM node:22.12.0-alpine3.21

ARG THEME
ENV THEME=$THEME

# @related: GITHUB_SHA_ENV_VAR
ARG GITHUB_SHA
ENV GITHUB_SHA=${GITHUB_SHA}

# Make sure the latest npm is installed for speed and fixes.
RUN npm i npm@latest -g

# Switch to root user to copy files safely
USER root

WORKDIR /home/node/app
COPY . .
RUN chown -R node:node /home/node/app


# The official Node image provides an unprivileged user as a security best
# practice, but it needs to be manually enabled. We put it here so npm installs
# dependencies as the same user who runs the app.
USER node

# Create workdir and copy source code into it, giving the node user read and
# execute permissions, but not alter permissions.

# Install dependencies.
RUN npm install

ENV PATH=/home/node/app/node_modules/.bin:$PATH

RUN npm run build

CMD [ "npm", "run", "start" ]