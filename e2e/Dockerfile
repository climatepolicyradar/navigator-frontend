FROM cypress/included:10.10.0

WORKDIR /opt
RUN npm install cypress-file-upload cypress-pseudo-localization dotenv
WORKDIR /opt/e2e

RUN npx cypress verify
