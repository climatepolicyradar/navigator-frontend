FROM node:20-alpine3.17

ARG THEME
ENV THEME=$THEME

# Install yarn globally
RUN corepack enable && corepack prepare yarn@stable --activate

# The official Node image provides an unprivileged user as a security best
# practice, but it needs to be manually enabled. We put it here so yarn installs
# dependencies as the same user who runs the app.
USER node

# Create workdir and copy source code into it, giving the node user read and
# execute permissions, but not alter permissions.
WORKDIR /home/node/app
COPY --chmod=0755  . .

# Install dependencies
RUN yarn install --frozen-lockfile && yarn cache clean

ENV PATH=/home/node/app/node_modules/.bin:$PATH

RUN yarn build

CMD [ "yarn", "start" ]