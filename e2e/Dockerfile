################################################################################
# Build Cypress image for CI.
#
# Notes:
# We don't need to add a 'cypress run' in this image as the Cypress image we are
# using includes that layer by default.
#
# If we want to take screenshots/videos on CI, we will need to add a step into
# this Dockerfile that will make the WORKDIR /tests writable by the 'node' user.
################################################################################
FROM cypress/included:10.10.0

WORKDIR /tests

# Install the dependencies. We only copy in the package.json file and mount the
# remaining test content via a volume to reduce the size of the image.
COPY package.json ./
RUN npm install

# Switch to the built-in  "node" user that comes from the base Node layer of the
# Cypress image.
RUN mv /root/.cache /home/node/.cache
USER node

ARG THEME
ENV THEME=${THEME}

HEALTHCHECK --interval=3s --timeout=3s --start-period=2s --retries=3    \
CMD cypress verify || exit 1