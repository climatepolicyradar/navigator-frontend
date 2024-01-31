.PHONEY: build run run_ci with_production

# These vars are only used for CI testing
TAG = local-frontend
THEME ?= cclw
API_URL ?= https://app.dev.climatepolicyradar.org/api/v1
S3_PATH ?= https://cpr-staging-targets-json-store.s3.eu-west-1.amazonaws.com
ADOBE_API_KEY ?= dca9187b65294374a6367824df902fdf

run: build
	docker run --rm -it \
		-p 3000:3000 \
		-e THEME=$(THEME) \
		-e API_URL=$(API_URL) \
		-e ADOBE_API_KEY=$(ADOBE_API_KEY) \
		-e S3_PATH=$(S3_PATH) \
		-e NODE_ENV="development" \
		-e ROBOTS="false" \
		-e HOSTNAME="http://localhost:3000" \
		-v $(PWD):/opt/node_app/app \
		$(TAG) npm run dev

with_production:
	make API_URL=https://api.climatepolicyradar.org/api/v1

build:
	docker build -t ${TAG} .

run_ci:
	docker run --rm -d \
		-p 3000:3000 \
		-e THEME=$(THEME) \
		-e API_URL=$(API_URL) \
		-e ADOBE_API_KEY=$(ADOBE_API_KEY) \
		-e S3_PATH=$(S3_PATH) \
		-e NODE_ENV="production" \
		-e ROBOTS="false" \
		-e HOSTNAME="http://localhost:3000" \
		$(TAG)
