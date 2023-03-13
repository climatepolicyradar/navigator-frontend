.PHONEY: build run run_ci with_production

TAG=local-frontend
THEME ?= cclw
API_URL ?= https://api.dev.climatepolicyradar.org/api/v1  

run: build
	docker run --rm -it \
		-p 3000:3000 \
		-e THEME=$(THEME) \
		-e API_URL=$(API_URL) \
		-e ADOBE_API_KEY=$(ADOBE_API_KEY) \
		-e NODE_ENV="development" \
		-e ROBOTS="false" \
		-e HOSTNAME="http://localhost:3000" \
		-v $(PWD):/opt/node_app/app \
		$(TAG) npm run dev

with_production:
	make APU_URL=https://api.climatepolicyradar.org/api/v1

build:
	docker build -t ${TAG} .

run_ci:
	docker run --rm -d \
		-p 3000:3000 \
		-e THEME=$(THEME) \
		-e API_URL=$(API_URL) \
		-e ADOBE_API_KEY=$(ADOBE_API_KEY) \
		-e NODE_ENV="production" \
		-e ROBOTS="false" \
		-e HOSTNAME="http://localhost:3000" \
		$(TAG)
