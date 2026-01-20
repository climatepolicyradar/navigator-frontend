.PHONEY: build run run_ci with_production

TAG = navigator-frontend
THEME ?= cclw
TARGETS_URL ?= https://cpr-staging-targets-json-store.s3.eu-west-1.amazonaws.com
CDN_URL ?= https://cdn.dev.climatepolicyradar.org
CONCEPTS_API_URL ?= https://api.climatepolicyradar.org
ADOBE_API_KEY ?= dca9187b65294374a6367824df902fdf
BACKEND_API_URL ?= https://cpr.staging.climatepolicyradar.org/api/v1
BACKEND_API_TOKEN ?= eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbGxvd2VkX2NvcnBvcmFfaWRzIjpbIkNDTFcuY29ycHVzLmkwMDAwMDAwMS5uMDAwMCIsIkNQUi5jb3JwdXMuaTAwMDAwMDAxLm4wMDAwIiwiVU5GQ0NDLmNvcnB1cy5pMDAwMDAwMDEubjAwMDAiXSwiZXhwIjoyMDQyMTEzMzY5LCJpYXQiOjE3MjY1NzY5NjksImlzcyI6IkNsaW1hdGUgUG9saWN5IFJhZGFyIiwic3ViIjoiQ1BSIiwiYXVkIjoiaHR0cHM6Ly9hcHAuZGV2LmNsaW1hdGVwb2xpY3lyYWRhci5vcmcvIn0.mJ2qLJmMyPLGt0rM_tTXhlVv1glxooxmQV0bWrvPwKU
REDIRECT_FILE="redirects.json"

build:
	docker build --build-arg THEME=${THEME} -t ${TAG}-${THEME} .

run: build
	docker run --rm -it \
		-p 3000:3000 \
		-e BACKEND_API_TOKEN=$(BACKEND_API_TOKEN) \
		-e BACKEND_API_URL=$(BACKEND_API_URL) \
		-e ADOBE_API_KEY=$(ADOBE_API_KEY) \
		-e TARGETS_URL=$(TARGETS_URL) \
		-e NODE_ENV="development" \
		-e ROBOTS="false" \
		-e HOSTNAME="http://localhost:3000" \
		-e CONCEPTS_API_URL=$(CONCEPTS_API_URL) \
		-e REDIRECT_FILE=$(REDIRECT_FILE) \
		-e CDN_URL=$(CDN_URL) \
		-v $(PWD):/opt/node_app/app \
		${TAG}-${THEME} npm run dev

with_production:
	make API_URL=https://api.climatepolicyradar.org/api/v1

run_ci:
	docker run --rm -d \
		-p 3000:3000 \
		-e THEME=$(THEME) \
		-e BACKEND_API_TOKEN=$(BACKEND_API_TOKEN) \
		-e BACKEND_API_URL=$(BACKEND_API_URL) \
		-e ADOBE_API_KEY=$(ADOBE_API_KEY) \
		-e TARGETS_URL=$(TARGETS_URL) \
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