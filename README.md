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

If you do not already have trunk.io installed on your machine, run `make install_trunk`
to install.

## Getting started

Local development can be done via Docker or manual installation.

## Environment

See the `.env.example` file for details of configuration environment variables.

## Testing

This project is tested with BrowserStack.
