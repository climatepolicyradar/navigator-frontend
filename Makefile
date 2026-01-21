.PHONY: build build_dev run run_dev with_production install_trunk

# DEV MODE
# dev mode takes environment vars from .env
# see Dockerfile.dev
build_dev:
	docker build -f Dockerfile.dev -t ${TAG}-dev .

run_dev: build_dev
	docker run --rm -it \
		-p 3000:3000 \
		-v $(PWD):/app \
		-v /app/node_modules \
		${TAG}-dev npm run dev
# END DEV MODE

TAG = navigator-frontend
THEME ?= cclw
TARGETS_URL ?= https://cpr-production-targets-json-store.s3.eu-west-1.amazonaws.com
CDN_URL ?= https://cdn.climatepolicyradar.org
CONCEPTS_API_URL ?= https://api.climatepolicyradar.org
ADOBE_API_KEY ?= dca9187b65294374a6367824df902fdf
BACKEND_API_URL ?= https://app.climatepolicyradar.org/api/v1
BACKEND_API_TOKEN ?= eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbGxvd2VkX2NvcnBvcmFfaWRzIjpbIkFjYWRlbWljLmNvcnB1cy5MaXRpZ2F0aW9uLm4wMDAwIiwiQ0NMVy5jb3JwdXMuaTAwMDAwMDAxLm4wMDAwIiwiQ1BSLmNvcnB1cy5Hb2xkc3RhbmRhcmQubjAwMDAiLCJDUFIuY29ycHVzLmkwMDAwMDAwMS5uMDAwMCIsIkNQUi5jb3JwdXMuaTAwMDAwMDAyLm4wMDAwIiwiQ1BSLmNvcnB1cy5pMDAwMDA1ODkubjAwMDAiLCJDUFIuY29ycHVzLmkwMDAwMDU5MS5uMDAwMCIsIkNQUi5jb3JwdXMuaTAwMDAwNTkyLm4wMDAwIiwiTUNGLmNvcnB1cy5BRi5HdWlkYW5jZSIsIk1DRi5jb3JwdXMuQUYubjAwMDAiLCJNQ0YuY29ycHVzLkNJRi5HdWlkYW5jZSIsIk1DRi5jb3JwdXMuQ0lGLm4wMDAwIiwiTUNGLmNvcnB1cy5HQ0YuR3VpZGFuY2UiLCJNQ0YuY29ycHVzLkdDRi5uMDAwMCIsIk1DRi5jb3JwdXMuR0VGLkd1aWRhbmNlIiwiTUNGLmNvcnB1cy5HRUYubjAwMDAiLCJPRVAuY29ycHVzLmkwMDAwMDAwMS5uMDAwMCIsIlVOLmNvcnB1cy5VTkNCRC5uMDAwMCIsIlVOLmNvcnB1cy5VTkNDRC5uMDAwMCIsIlVORkNDQy5jb3JwdXMuaTAwMDAwMDAxLm4wMDAwIl0sInN1YiI6IkNQUiIsImF1ZCI6ImxvY2FsaG9zdCIsImlzcyI6IkNsaW1hdGUgUG9saWN5IFJhZGFyIiwiZXhwIjoyMDc3OTgzNzUwLjAsImlhdCI6MTc2MjQ1MDk1MH0.8zzDrsre801pywPKGNl5AF29hnvPYvFWiMC3dyIddsg
REDIRECT_FILE="redirects.json"

build:
	docker build --build-arg THEME=${THEME} -t ${TAG}-${THEME} .

run: build
	docker run --rm -it \
		-p 3000:3000 \
		-e THEME=$(THEME) \
		-e BACKEND_API_TOKEN=$(BACKEND_API_TOKEN) \
		-e BACKEND_API_URL=$(BACKEND_API_URL) \
		-e ADOBE_API_KEY=$(ADOBE_API_KEY) \
		-e TARGETS_URL=$(TARGETS_URL) \
		-e ROBOTS="false" \
		-e HOSTNAME="http://localhost:3000" \
		-e CONCEPTS_API_URL=$(CONCEPTS_API_URL) \
		-e REDIRECT_FILE=$(REDIRECT_FILE) \
		-e CDN_URL=$(CDN_URL) \
		${TAG}-${THEME}

with_production:
	make API_URL=https://api.climatepolicyradar.org/api/v1

install_trunk:
	$(eval trunk_installed=$(shell trunk --version > /dev/null 2>&1 ; echo $$? ))
ifneq (${trunk_installed},0)
	$(eval OS_NAME=$(shell uname -s | tr A-Z a-z))
	curl https://get.trunk.io -fsSL | bash
endif

uninstall_trunk:
	sudo rm -if `which trunk`
	rm -ifr ${HOME}/.cache/trunk
