FROM node:22.12.0-alpine3.21

ARG THEME
ENV THEME=$THEME

# Make sure the latest npm is installed for speed and fixes.
RUN npm i npm@latest -g

# The official Node image provides an unprivileged user as a security best
# practice, but it needs to be manually enabled. We put it here so npm installs
# dependencies as the same user who runs the app.
USER node

# Create workdir and copy source code into it, giving the node user read and
# execute permissions, but not alter permissions.
WORKDIR /home/node/app
COPY --chmod=0755  . .

# Install dependencies.
RUN npm ci && npm cache clean --force

ENV PATH=/home/node/app/node_modules/.bin:$PATH

RUN npm run build

CMD [ "npm", "run", "start" ]