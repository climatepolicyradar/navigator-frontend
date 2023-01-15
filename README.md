# Navigator frontend

This repository contains the code necessary to build the `navigator-frontend` container.
These containers are pushed into AWS ECR (see `ci.yml`) and are used as part of the CPR application deployment.
(see https://github.com/climatepolicyradar/navigator-infra)

## TL;DR

Run `make` or `make THEME=cclw`

## Requirements

- make  
- docker
## Getting started

Local development is done using docker 

## Environment

See the `.env.example` file for details of configuration environment variables.

## Testing

This project is tested with BrowserStack.