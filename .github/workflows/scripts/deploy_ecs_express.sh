#!/usr/bin/env bash
#
# Deploy IMAGE to an ECS Express service, correcting its generated
# RollbackAlarm to judge deployment health on 5xx only. Most of our 4xx is
# crawler noise and says nothing about task health; a genuinely broken build
# still rolls back via 5xx or the untouched circuit breaker.
#
# ECS rewrites the alarm once at deployment start (observed +2..35s after
# the service update; CloudTrail Aug 18-24) and otherwise only on rollback.
# So: write the corrected alarm before starting, so ours is live from second
# zero; watch for ECS's rewrite landing on top; re-write the moment it does.
# The stock alarm is live for seconds at most.
#
# It also turns off Express Mode's canary. Express creates services with a
# CANARY strategy (5% of traffic for 3 min, then 100% and a further 3 min
# bake), which spends ~6 min of every deploy waiting. We switch the service
# to BLUE_GREEN with no bake: traffic moves in one step once the new tasks
# pass health checks, and the old tasks go straight away. That matches how
# our non-Express ECS services deployed. The circuit breaker still rolls back
# tasks that never become healthy.
#
# Usage: deploy_ecs_express.sh <cluster> <service> <image>
#   e.g. deploy_ecs_express.sh frontend-production cpr-frontend-production <image>

set -euo pipefail

CLUSTER="${1:?usage: deploy_ecs_express.sh <cluster> <service> <image>}"
SERVICE="${2:?}"
IMAGE="${3:?}"

ALARM="${CLUSTER}/${SERVICE}/RollbackAlarm"
MARKER="5xx-only; 4xx excluded by deploy_ecs_express.sh"

alarm_description() {
	aws cloudwatch describe-alarms --alarm-names "${ALARM}" \
		--query 'MetricAlarms[0].AlarmDescription' --output text
}

# Read the live alarm, drop the 4xx terms, floor 5xx at 5/min so one stray
# 502 against a quiet minute cannot trip FILL(total, 1). Everything else --
# rollback wiring, threshold, evaluation -- is ECS's own, left intact.
correct_alarm() {
	local patched
	patched=$(aws cloudwatch describe-alarms --alarm-names "${ALARM}" \
		--query 'MetricAlarms[0]' | jq --arg d "${MARKER}" '
		{AlarmName, ComparisonOperator, EvaluationPeriods, DatapointsToAlarm,
		 Threshold, TreatMissingData, AlarmDescription: $d,
		 Metrics: [.Metrics[] | select(.Id | test("_4xx$") | not)
			| if .Expression then .Expression |= gsub(
				"IF\\(m[0-9]+_4xx < 5, 0, m[0-9]+_4xx\\) \\+ (?<b>m[0-9]+_5xx)";
				"IF(\(.b) < 5, 0, \(.b))") else . end]}')
	# gsub matched nothing: ECS changed the expression shape; do not write.
	[[ ${patched} == *"5xx < 5"* ]] || {
		echo "::error::alarm expression unrecognised -- not patching"
		exit 1
	}
	aws cloudwatch put-metric-alarm --cli-input-json "${patched}"
	echo "corrected ${ALARM}"
}

# One-step blue/green, no bake. A deployment's strategy is fixed when it
# starts, so this has to land before update-express-gateway-service.
STRATEGY='.strategy == "BLUE_GREEN" and .bakeTimeInMinutes == 0'

deployment_configuration() {
	aws ecs describe-services --cluster "${CLUSTER}" --services "${SERVICE}" \
		--query 'services[0].deploymentConfiguration' --output json
}

remove_canary() {
	local current patched from
	current=$(deployment_configuration)
	if jq -e "${STRATEGY}" <<<"${current}" >/dev/null; then
		echo "${SERVICE} already deploys blue/green with no bake"
		return
	fi
	# Keep the circuit breaker, alarm and task percentages as they are; only
	# the strategy and its timings change. update-service replaces the whole
	# deploymentConfiguration, so send it all back.
	patched=$(jq -c '.strategy = "BLUE_GREEN" | .bakeTimeInMinutes = 0
		| del(.canaryConfiguration, .linearConfiguration)' <<<"${current}")
	aws ecs update-service --cluster "${CLUSTER}" --service "${SERVICE}" \
		--deployment-configuration "${patched}" >/dev/null
	from=$(jq -r .strategy <<<"${current}")
	echo "switched ${SERVICE} from ${from} to blue/green, no bake"
}

correct_alarm
remove_canary

# Start the deployment: the running container spec, image swapped.
SERVICE_ARN=$(aws ecs describe-services --cluster "${CLUSTER}" --services "${SERVICE}" \
	--query 'services[0].serviceArn' --output text)
CONTAINER=$(aws ecs describe-express-gateway-service --service-arn "${SERVICE_ARN}" \
	--query 'service.activeConfigurations[0].primaryContainer' --output json |
	jq -c --arg image "${IMAGE}" '.image = $image')
aws ecs update-express-gateway-service \
	--service-arn "${SERVICE_ARN}" --primary-container "${CONTAINER}" >/dev/null
echo "deployment started: ${IMAGE}"

# Watch for ECS's rewrite; re-correct the moment it lands. Stop once it has,
# or at 60s -- well past the observed window.
for _ in $(seq 1 30); do
	DESC=$(alarm_description)
	if [[ ${DESC} != "${MARKER}" ]]; then
		correct_alarm
		break
	fi
	sleep 2
done

# Express may re-apply its canary when the deployment starts, as it does the
# alarm. If it has, this deployment runs the canary; say so rather than
# failing, since the deploy itself is still fine.
LIVE_CONFIG=$(deployment_configuration)
jq -e "${STRATEGY}" <<<"${LIVE_CONFIG}" >/dev/null ||
	echo "::warning::Express reset the deployment strategy; this deploy runs the canary"

# Wait on the deployment. status, not rolloutState: a finished rollback
# reports rolloutState COMPLETED, which reads as success.
DEPLOYMENT=$(aws ecs list-service-deployments --cluster "${CLUSTER}" --service "${SERVICE}" \
	--query 'serviceDeployments[0].serviceDeploymentArn' --output text)
STATUS=PENDING
for _ in $(seq 1 120); do
	STATUS=$(aws ecs describe-service-deployments --service-deployment-arns "${DEPLOYMENT}" \
		--query 'serviceDeployments[0].status' --output text)
	echo "  ${STATUS}"
	case "${STATUS}" in
	SUCCESSFUL) break ;;
	PENDING | IN_PROGRESS | STOP_REQUESTED) sleep 15 ;;
	*)
		echo "::error::deployment ended ${STATUS}"
		exit 1
		;;
	esac
done
[[ ${STATUS} == SUCCESSFUL ]] || {
	echo "::error::timed out waiting on ${DEPLOYMENT}"
	exit 1
}

# ECS only touches the alarm at start and rollback; if ours is gone the
# schedule has changed and the next deploy may fail on 4xx with no signal.
LIVE=$(alarm_description)
[[ ${LIVE} == "${MARKER}" ]] ||
	echo "::warning::corrected alarm did not hold (now: '${LIVE}')"

echo "deployment succeeded"
