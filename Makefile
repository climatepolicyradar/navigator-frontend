.PHONEY: build run run_ci with_production

TAG = navigator-frontend
THEME ?= cpr
API_URL ?= https://app.climatepolicyradar.org/api/v1
CDN_URL ?= https://cdn.climatepolicyradar.org
TARGETS_URL ?= https://cpr-production-targets-json-store.s3.eu-west-1.amazonaws.com
ADOBE_API_KEY ?= dca9187b65294374a6367824df902fdf
NEXT_PUBLIC_APP_TOKEN ?= eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbGxvd2VkX2NvcnBvcmFfaWRzIjpbXSwiZXhwIjoyMDU0ODEzNDQ3LCJpYXQiOjE3MzkyODA2NDcsImlzcyI6IkNsaW1hdGUgUG9saWN5IFJhZGFyIiwic3ViIjoiY3ByIiwiYXVkIjoiYXBwLmNsaW1hdGVwb2xpY3lyYWRhci5vcmcifQ.hnCG-kx3mBhUfQxvFJHXmEDFfdME03TltUQFpDcW_qI

build:
	docker build --build-arg THEME=${THEME} -t ${TAG}-${THEME} .

run: build
	docker run --rm -it \
		-p 3000:3000 \
		-e THEME=$(THEME) \
		-e NEXT_PUBLIC_APP_TOKEN=$(NEXT_PUBLIC_APP_TOKEN) \
		-e API_URL=$(API_URL) \
		-e ADOBE_API_KEY=$(ADOBE_API_KEY) \
		-e TARGETS_URL=$(TARGETS_URL) \
		-e NODE_ENV="development" \
		-e ROBOTS="false" \
		-e HOSTNAME="http://localhost:3000" \
		-v $(PWD):/opt/node_app/app \
		${TAG}-${THEME} npm run dev

with_production:
	make API_URL=https://api.climatepolicyradar.org/api/v1

run_ci:
	docker run --rm -d \
		-p 3000:3000 \
		-e THEME=$(THEME) \
		-e NEXT_PUBLIC_APP_TOKEN=$(NEXT_PUBLIC_APP_TOKEN) \
		-e API_URL=$(API_URL) \
		-e ADOBE_API_KEY=$(ADOBE_API_KEY) \
		-e S3_PATH=$(S3_PATH) \
		-e NODE_ENV="production" \
		-e ROBOTS="false" \
		-e HOSTNAME="http://localhost:3000" \
		${TAG}-${THEME}

install_trunk:
	$(eval trunk_installed=$(shell trunk --version > /dev/null 2>&1 ; echo $$? ))
ifneq (${trunk_installed},0)
	$(eval OS_NAME=$(shell uname -s | tr A-Z a-z))
	curl https://get.trunk.io -fsSL | bash
endif

uninstall_trunk:
	sudo rm -if `which trunk`
	rm -ifr ${HOME}/.cache/trunk

build_custom_app: ## Creates a directory for the custom app with the required files
	. "${PWD}"/scripts/build-custom-app.sh

delete_custom_app: ## Deletes a custom app and its related files / directories
	. "${PWD}"/scripts/delete-custom-app.sh