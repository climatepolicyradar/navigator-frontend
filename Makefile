TAG=navigator-frontend
# Use THEME from environment (e.g. CI) when set; otherwise read from .env
THEME ?= $(shell grep '^THEME=' .env 2>/dev/null | cut -d '=' -f2)

# DEV MODE
# dev mode takes environment vars from .env
# see Dockerfile.dev
build_dev:
	docker build -f Dockerfile.dev -t ${TAG}-dev .

generate_tsconfig:
	cp tsconfig.base.json tsconfig.json
	sed -i '' "s/__THEME__/$(THEME)/g" tsconfig.json

run_dev: build_dev generate_tsconfig
	docker run --rm -it \
		-p 3000:3000 \
		-v $(PWD):/app \
		-v /app/node_modules \
		${TAG}-dev npm run dev
# END DEV MODE

build:
	docker build --build-arg THEME=${THEME} -t ${TAG}-${THEME} .

# Helper function to run the production version of the app in a container
# Reads env vars from the env.example file. HOSTNAME/PORT override so the server
# binds to 0.0.0.0:8080 (Next.js uses HOSTNAME for bind; .env.example uses it as app URL).
run: build
	docker run --rm -it \
		-p 8080:8080 \
		--env-file ./.env.example \
		${TAG}-${THEME}

# --- Production deploy (local machine) ---
# Mirrors .github/workflows/deploy-production.yml and deploy-all-production.yml:
# build with THEME + GITHUB_SHA, push navigator-frontend-<theme>:latest.
#
# Prerequisites: Docker, AWS CLI, credentials for the production ECR account
# (same as GitHub's navigator-new-frontend-github-actions role would use).
#
# Registry: set DOCKER_REGISTRY (GitHub secret name) or ECR_REGISTRY explicitly,
# otherwise it defaults to <caller-account>.dkr.ecr.eu-west-1.amazonaws.com.
#
# Optional: REQUIRE_MAIN_BRANCH=0 to skip the main-branch guard (CI enforces main).
AWS_REGION ?= eu-west-1
IMAGE_TAG_PRODUCTION ?= latest
GITHUB_SHA ?= $(shell git rev-parse HEAD)
PRODUCTION_THEMES := cpr cclw mcf ccc
DEPLOY_FROM_MAIN_BRANCH_ONLY ?= 1
ECR_REGISTRY ?= $(if $(DOCKER_REGISTRY),$(DOCKER_REGISTRY),$(shell aws sts get-caller-identity --query Account --output text).dkr.ecr.eu-west-1.amazonaws.com)

.PHONY: deploy-production-ecr-login deploy-production-build-push deploy-production-theme deploy-production-all

deploy-production-ecr-login:
	aws ecr get-login-password --region $(AWS_REGION) | docker login --username AWS --password-stdin $(shell aws sts get-caller-identity --query 'Account' --output text).dkr.ecr.eu-west-1.amazonaws.com

deploy-production-build-push:
	@test -n "$(THEME)" || (echo "Set THEME=cpr|cclw|mcf|ccc"; exit 1)
	@test "$(filter $(THEME),$(PRODUCTION_THEMES))" = "$(THEME)" || (echo "Invalid THEME=$(THEME)"; exit 1)
	docker build --platform linux/amd64 \
		--build-arg THEME=$(THEME) \
		--build-arg GITHUB_SHA=$(GITHUB_SHA) \
		-t $(ECR_REGISTRY)/navigator-frontend-$(THEME):$(IMAGE_TAG_PRODUCTION) .
	docker push $(ECR_REGISTRY)/navigator-frontend-$(THEME):$(IMAGE_TAG_PRODUCTION)
	echo "Pushed $(ECR_REGISTRY)/navigator-frontend-$(THEME):$(IMAGE_TAG_PRODUCTION)"

deploy-production-theme:
	@test -n "$(THEME)" || (echo "Usage: make deploy-production-theme THEME=cpr"; exit 1)
	@test "$(filter $(THEME),$(PRODUCTION_THEMES))" = "$(THEME)" || (echo "Invalid THEME=$(THEME)"; exit 1)
ifeq ($(REQUIRE_MAIN_BRANCH),1)
	@test "$$(git rev-parse --abbrev-ref HEAD)" = "main" || (echo "Production deploy expects branch main (set REQUIRE_MAIN_BRANCH=0 to override)."; exit 1)
endif
	$(MAKE) deploy-production-ecr-login
	$(MAKE) deploy-production-build-push THEME=$(THEME)

deploy-production-all:
ifeq ($(REQUIRE_MAIN_BRANCH),1)
	@test "$$(git rev-parse --abbrev-ref HEAD)" = "main" || (echo "Production deploy expects branch main (set REQUIRE_MAIN_BRANCH=0 to override)."; exit 1)
endif
	$(MAKE) deploy-production-ecr-login
	@for t in $(PRODUCTION_THEMES); do $(MAKE) deploy-production-build-push THEME=$$t; done
