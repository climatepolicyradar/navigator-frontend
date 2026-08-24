#!/usr/bin/env bash
#
# Deploy IMAGE to an ECS Express frontend service, correcting the service's
# ECS-generated RollbackAlarm to judge deployment health on 5xx only.
#
# The generated alarm rolls a deployment back at >1% 4xx+5xx. On a public site
# most 4xx is crawler traffic: 90% of ours is bots hitting stale URLs, and a
# burst against quiet-hours traffic reads as a 30% "error rate". Client errors
# say nothing about whether the new tasks are healthy, so they are excluded
# here; a genuinely broken build fails via 5xx (SSR crashes exceed the floor
# within a minute) or via the untouched circuit breaker.
#
# ECS rewrites the alarm at deployment start (observed +2..35s after the
# service update; CloudTrail Aug 18-24) and touches it again only when a
# rollback fires. So: start the deployment, sleep out the rewrite window,
# write the corrected alarm once, and confirm at the end that it held. The
# fixed sleep beats watching the alarm's updated-timestamp: the pulumi step
# just before this can trigger its own rewrite seconds earlier, which makes
# timestamps ambiguous. 65s > the 35s observed worst case.
#
# Everything else -- rollback wiring, threshold, evaluation periods -- is
# ECS's own definition, read back and left intact. The only edits: drop the
# 4xx terms, floor 5xx at 5/min so one stray 502 in a quiet minute cannot
# trip FILL(total, 1).
#
# Takes the cluster and service name directly so it can also be run by hand
# against a review-stack service (review stacks deploy via Pulumi Deployments,
# which never runs this script):
#   deploy_ecs_express.sh frontend-production review-cpr-frontend-1472 <image>
#
# Usage: deploy_ecs_express.sh <cluster> <service> <image>

set -euo pipefail

CLUSTER="${1:?usage: deploy_ecs_express.sh <cluster> <service> <image>}"
SERVICE="${2:?}"
IMAGE="${3:?}"

ALARM="${CLUSTER}/${SERVICE}/RollbackAlarm"
MARKER="5xx-only; 4xx excluded by deploy_ecs_express.sh"
PATCHED=$(mktemp)

# Start the deployment: the running container spec with only the image swapped.
SERVICE_ARN=$(aws ecs describe-services --cluster "${CLUSTER}" --services "${SERVICE}" \
	--query 'services[0].serviceArn' --output text)
CONTAINER=$(aws ecs describe-express-gateway-service --service-arn "${SERVICE_ARN}" \
	--query 'service.activeConfigurations[0].primaryContainer' --output json |
	jq -c --arg image "${IMAGE}" '.image = $image')
aws ecs update-express-gateway-service \
	--service-arn "${SERVICE_ARN}" --primary-container "${CONTAINER}" >/dev/null
echo "deployment started: ${IMAGE}"

# Wait out ECS's alarm rewrite window, then correct the alarm in place.
sleep 65
aws cloudwatch describe-alarms --alarm-names "${ALARM}" --query 'MetricAlarms[0]' |
	jq --arg d "${MARKER}" '
		{AlarmName, ComparisonOperator, EvaluationPeriods, DatapointsToAlarm,
		 Threshold, TreatMissingData, AlarmDescription: $d,
		 Metrics: [.Metrics[] | select(.Id | test("_4xx$") | not)
			| if .Expression then .Expression |= gsub(
				"IF\\(m[0-9]+_4xx < 5, 0, m[0-9]+_4xx\\) \\+ (?<b>m[0-9]+_5xx)";
				"IF(\(.b) < 5, 0, \(.b))") else . end]}' \
		>"${PATCHED}"
# If ECS changed the expression's shape the gsub matched nothing: keep their
# alarm rather than mislabel it as ours.
grep -q '5xx < 5' "${PATCHED}" || {
	echo "::error::alarm expression did not match; ECS changed it -- not patching"
	exit 1
}
aws cloudwatch put-metric-alarm --cli-input-json "file://${PATCHED}"
echo "corrected ${ALARM}"

# Wait on the deployment. Poll status, not rolloutState: after a rollback the
# surviving revision reports rolloutState COMPLETED, which reads as success.
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
if [[ ${STATUS} != SUCCESSFUL ]]; then
	echo "::error::timed out waiting on ${DEPLOYMENT}"
	exit 1
fi

# Sentinel: per the observed schedule ECS cannot have rewritten the alarm
# mid-bake. If it did, the timing model has changed and the next deploy may
# fail on 4xx again with no other signal.
LIVE=$(aws cloudwatch describe-alarms --alarm-names "${ALARM}" \
	--query 'MetricAlarms[0].AlarmDescription' --output text)
if [[ ${LIVE} != "${MARKER}" ]]; then
	echo "::warning::corrected alarm did not hold through the bake (now: '${LIVE}') -- the ECS rewrite schedule has changed; see script header"
fi
echo "deployment succeeded"
