FROM cypress/included:10.10.0

WORKDIR /opt
RUN npm i
WORKDIR /opt/e2e

RUN npx cypress verify
