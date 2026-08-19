#!/usr/bin/env bash
#
# Block until a frontend service's newest deployment reaches a terminal state.
#
# Replaces the polling built into aws-actions/amazon-ecs-deploy-express-service,
# whose 15 minute timeout is hardcoded -- observed deployments of this service
# run to ~10 minutes, and a slow one would fail the job despite succeeding.
#
# Polls the service deployment `status`, NOT `rolloutState`. After a rollback
# the surviving deployment reports `rolloutState: COMPLETED`, meaning "the
# rollback finished", which reads as success if you check the wrong field.
#
# Usage: wait_for_deployment.sh <theme> [env] [timeout-seconds]

set -euo pipefail

THEME="${1:?usage: wait_for_deployment.sh <theme> [env] [timeout]}"
ENVIRONMENT="${2:-production}"
TIMEOUT="${3:-1800}"
INTERVAL=15

CLUSTER="frontend-${ENVIRONMENT}"
SERVICE="${THEME}-frontend-${ENVIRONMENT}"

DEPLOY_ARN=$(aws ecs list-service-deployments \
	--cluster "${CLUSTER}" --service "${SERVICE}" \
	--query 'serviceDeployments[0].serviceDeploymentArn' --output text)

if [[ -z ${DEPLOY_ARN} ]] || [[ ${DEPLOY_ARN} == "None" ]]; then
	echo "::error::no service deployment found for ${SERVICE}"
	exit 1
fi

echo "waiting on ${DEPLOY_ARN}"
ELAPSED=0

while [[ ${ELAPSED} -lt ${TIMEOUT} ]]; do
	STATUS=$(aws ecs describe-service-deployments \
		--service-deployment-arns "${DEPLOY_ARN}" \
		--query 'serviceDeployments[0].status' --output text)

	case "${STATUS}" in
	SUCCESSFUL)
		echo "deployment succeeded after ${ELAPSED}s"
		exit 0
		;;
	PENDING | IN_PROGRESS | STOP_REQUESTED)
		printf '  %4ds  %s\n' "${ELAPSED}" "${STATUS}"
		;;
	*)
		# ROLLBACK_IN_PROGRESS, ROLLBACK_SUCCESSFUL, ROLLBACK_FAILED, STOPPED
		echo "::error::deployment did not succeed (status=${STATUS})"
		echo "recent service events:"
		aws ecs describe-services --cluster "${CLUSTER}" --services "${SERVICE}" \
			--query 'services[0].events[:10].[createdAt,message]' --output text
		exit 1
		;;
	esac

	sleep "${INTERVAL}"
	ELAPSED=$((ELAPSED + INTERVAL))
done

echo "::error::timed out after ${TIMEOUT}s waiting for ${DEPLOY_ARN}"
exit 1
