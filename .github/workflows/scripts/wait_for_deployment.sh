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

CLUSTER="frontend-${ENVIRONMENT}"
SERVICE="${THEME}-frontend-${ENVIRONMENT}"
ALARM="${CLUSTER}/${SERVICE}/RollbackAlarm"
NEUTRALISED="Neutralised by fix_rollback_alarm.sh"
SCRIPTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Poll faster when holding the alarm down: the interval is the width of the
# window in which ECS's version can be live and sampled.
if [[ -n ${HOLD_ROLLBACK_ALARM:-} ]]; then
	INTERVAL=5
else
	INTERVAL=15
fi

DEPLOY_ARN=$(aws ecs list-service-deployments \
	--cluster "${CLUSTER}" --service "${SERVICE}" \
	--query 'serviceDeployments[0].serviceDeploymentArn' --output text)

if [[ -z ${DEPLOY_ARN} ]] || [[ ${DEPLOY_ARN} == "None" ]]; then
	echo "::error::no service deployment found for ${SERVICE}"
	exit 1
fi

echo "waiting on ${DEPLOY_ARN}"
ELAPSED=0
REVERTS=0

while [[ ${ELAPSED} -lt ${TIMEOUT} ]]; do
	# HOTFIX. A single write of the neutralised alarm does not survive: ECS
	# restores its own version partway through the bake, so we reinstate ours
	# on every poll to keep the window in which ECS's alarm is live as small
	# as the poll interval.
	#
	# This is a race, not a guarantee -- updating an alarm leaves its state
	# unchanged, so there is no counter being reset, and nothing stops ECS's
	# version being live at the moment ECS samples it. The revert count
	# printed at the end is there to show whether this is holding.
	# @related: ROLLBACK_ALARM_TIMING
	if [[ -n ${HOLD_ROLLBACK_ALARM:-} ]]; then
		LIVE=$(aws cloudwatch describe-alarms --alarm-names "${ALARM}" \
			--query 'MetricAlarms[0].[AlarmDescription,StateValue]' --output text)

		if [[ ${LIVE} != "${NEUTRALISED}"* ]]; then
			REVERTS=$((REVERTS + 1))
			printf '  %4ds  ECS reverted the alarm (%d) [%s] -- reinstating\n' \
				"${ELAPSED}" "${REVERTS}" "${LIVE}"
			# Non-fatal: if ECS wins this round we simply try again next poll.
			"${SCRIPTS_DIR}/fix_rollback_alarm.sh" "${THEME}" "${ENVIRONMENT}" \
				>/dev/null 2>&1 || true
		fi
	fi

	STATUS=$(aws ecs describe-service-deployments \
		--service-deployment-arns "${DEPLOY_ARN}" \
		--query 'serviceDeployments[0].status' --output text)

	case "${STATUS}" in
	SUCCESSFUL)
		echo "deployment succeeded after ${ELAPSED}s (alarm reverted by ECS ${REVERTS}x)"
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
