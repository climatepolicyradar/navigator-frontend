# Navigator Frontend

This repository contains the code necessary to build the `navigator-frontend`
container.

These containers are pushed into AWS ECR (see `ci.yml`) and are used as part of
the CPR application deployment.
(see <https://github.com/climatepolicyradar/navigator-infra>)

## TL;DR

Run `make` or `make THEME=cclw`

## Requirements

- make
- Docker
- Trunk.io (for code quality)
- Node

If you do not already have trunk.io installed on your machine, run `make install_trunk`
to install.

## Getting started

Local development can be done via Docker or manual installation.

## Environment

See the `.env.example` file for details of configuration environment variables.

## Testing

This project is tested with BrowserStack.

## Running the project

If you have not yet run an install for the repo

```bash
npm install
```

Create a .env file

```bash
cp .env.example .env
```

Run project locally

```bash
npm run dev
```

or

```bash
yarn dev
```

Set the 'theme' to run the appropriate environment/app i.e. to run the cclw app
locally update the .env file to 'THEME=cclw' or run the following:

```bash
THEME=cclw npm run dev
```
