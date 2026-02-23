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
		-e HOSTNAME=0.0.0.0 \
		-e PORT=8080 \
		${TAG}-${THEME}
