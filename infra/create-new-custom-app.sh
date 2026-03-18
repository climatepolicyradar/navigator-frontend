#!/bin/bash
###############################################################################
# Generate frontend infrastructure for new Custom App
#
# Prerequisites:
# - Pulumi CLI
#
# This script has been tested only using Pulumi version 3.104.2 on Linux.
###############################################################################
set -e

# Check Pulumi is installed
if ! command -v pulumi &>/dev/null; then
	echo "pulumi not installed. Please install pulumi CLI..."
	exit 1
fi

echo "Given the following AWS environment options:"
PS3="Please type the number that corresponds to the environment you want to create the Pulumi stack for: "
select aws_environment in staging production sandbox; do
	case ${aws_environment} in
	"staging")
		AWS_ENV=${aws_environment}
		break
		;;
	"production")
		AWS_ENV=${aws_environment}
		break
		;;
	"sandbox")
		AWS_ENV=${aws_environment}
		break
		;;
	"q")
		exit
		;;
	*)
		echo "Ooops"
		;;
	esac
done
echo "You have selected a '${AWS_ENV}' environment"
printf "\n"

read -rp "Input the acronym for the custom app theme (e.g. CPR, CCLW, OEP, MCF...): " theme
theme="$(tr "[:upper:]" "[:lower:]" <<<"${theme}")"

stack_name=${theme}-${AWS_ENV}
echo "Creating Pulumi stack '${stack_name}' in 'climatepolicyradar' organisation..."
pulumi stack init "climatepolicyradar/${stack_name}"
printf "\n"

echo "Setting generic custom app config..."
pulumi config set aws:region eu-west-1
pulumi config set redirect_file default.json
pulumi config set robots "false"
printf "\n"

echo "Setting secret generic custom app config..."
printf "adobe_api_key "
pulumi config set --secret adobe_api_key
printf "backend_api_url "
pulumi config set --secret backend_api_url
printf "targets_url "
pulumi config set targets_url
printf "cdn_url "
pulumi config set cdn_url
printf "validation_account_id "
pulumi config set --secret validation_account_id
printf "auto_scaling_config_arn "
pulumi config set --secret auto_scaling_config_arn
printf "\n"

echo "Setting specific custom app config..."
printf "app_token "
pulumi config set --secret app_token
printf "docker_tag "
pulumi config set docker_tag
printf "ecr_uri "
pulumi config set --secret ecr_uri
printf "app_url "
pulumi config set app_url
pulumi config set theme "${theme}"
printf "\n"

echo "Finished creating Pulumi stack '${stack_name}'."

echo "Validating Pulumi config..."

REQUIRED_KEYS=(
	"aws:region"
	"frontend:adobe_api_key"
	"frontend:backend_api_url"
	"frontend:backend_api_token"
	"frontend:auto_scaling_config_arn"
	"frontend:docker_tag"
	"frontend:ecr_uri"
	"frontend:app_url"
	"frontend:redirect_file"
	"frontend:robots"
	"frontend:targets_url"
	"frontend:cdn_url"
	"frontend:theme"
	"frontend:validation_account_id"
)

CONFIG_FILE="Pulumi.${stack_name}.yaml"
for key in "${REQUIRED_KEYS[@]}"; do
	if ! grep -q "${key}" "${CONFIG_FILE}"; then
		echo "Error: Missing required key '${key}' in ${CONFIG_FILE}"
		exit 1
	fi
done

echo "All required keys are present in ${CONFIG_FILE}."
