set dotenv-load := true

tag := "navigator-frontend"

# THEME from the environment (e.g. CI) when set; otherwise read from .env
theme := env_var_or_default("THEME", `grep '^THEME=' .env 2>/dev/null | cut -d '=' -f2`)

# Set the default command to list all available commands
default:
    @just --list

# DEV MODE
# dev mode takes environment vars from .env
# see Dockerfile.dev
build-dev:
    docker build -f Dockerfile.dev -t {{ tag }}-dev .

generate-tsconfig:
    cp tsconfig.base.json tsconfig.json
    sed -i '' "s/__THEME__/{{ theme }}/g" tsconfig.json

run-dev: build-dev generate-tsconfig
    docker run --rm -it \
        -p 3000:3000 \
        -v {{ justfile_directory() }}:/app \
        -v /app/node_modules \
        {{ tag }}-dev npm run dev
# END DEV MODE

build:
    docker build --build-arg THEME={{ theme }} --build-arg GITHUB_SHA=$(git rev-parse HEAD) -t {{ tag }}-{{ theme }} .

# Run the production version of the app in a container.
# Reads env vars from the env.example file. HOSTNAME/PORT override so the server
# binds to 0.0.0.0:8080 (Next.js uses HOSTNAME for bind; .env.example uses it as app URL).
run: build
    docker run --rm -it \
        -p 8080:8080 \
        --env-file ./.env.example \
        {{ tag }}-{{ theme }}
