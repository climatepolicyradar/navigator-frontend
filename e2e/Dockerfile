FROM cypress/included:10.10.0

WORKDIR /opt
# Need to explicitly install the dependencies here, as the package.json is not copied into the image
RUN npm install cypress-file-upload cypress-pseudo-localization dotenv neat-csv
WORKDIR /opt/e2e

RUN npx cypress verify
