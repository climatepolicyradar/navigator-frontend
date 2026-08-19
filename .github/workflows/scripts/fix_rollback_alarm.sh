#!/usr/bin/env bash
#
# Neutralise the RollbackAlarm that ECS Express generates for a frontend service.
#
# Express Mode creates `<cluster>/<service>/RollbackAlarm` and rolls a deployment
# back if it fires. Its expression is wrong for us:
#
#   100 * (IF(m_4xx < 5, 0, m_4xx) + m_5xx) / FILL(RequestCountPerTarget, 1) > 1
#
#   1. It counts 4XX. Expected 404s from crawlers fail deployments that are fine.
#   2. The numerator is fleet-wide but the denominator is per-task, overstating
#      the error rate by exactly the running task count (measured at 3.00x).
#      The autoscaler also targets RequestCountPerTarget, so it pins the
#      denominator and the reported rate stops depending on traffic at all.
#
# In practice this rolled back seven consecutive production deployments with
# zero 5XX responses in the entire window.
#
# There is no supported way to configure or opt out of it: the alarm is absent
# from the ECS API model entirely, and emptying the service's
# `deploymentConfiguration.alarms` does not survive -- ECS restores that block
# within ~7s of a deployment starting. What it does not do is touch the alarm
# again afterwards, so we repoint it at a metric that is never published.
#
# The alarm therefore stays in place and enabled, exactly as ECS expects, but
# can never breach. Deployment safety falls to the circuit breaker, which is
# left on and still rolls back a revision whose tasks cannot reach a steady
# state.
#
# MUST run *after* the deployment has started, or ECS discards the change.
#
# Usage: fix_rollback_alarm.sh <theme> [env]

set -euo pipefail

THEME="${1:?usage: fix_rollback_alarm.sh <theme> [env]}"
ENVIRONMENT="${2:-production}"

CLUSTER="frontend-${ENVIRONMENT}"
SERVICE="${THEME}-frontend-${ENVIRONMENT}"
ALARM="${CLUSTER}/${SERVICE}/RollbackAlarm"
DESCRIPTION="Neutralised by fix_rollback_alarm.sh"

# Nothing publishes to this namespace, and missing data is not a breach, so the
# alarm sits in INSUFFICIENT_DATA and never triggers a rollback.
aws cloudwatch put-metric-alarm \
	--alarm-name "${ALARM}" \
	--alarm-description "${DESCRIPTION}" \
	--namespace "Frontend/RollbackAlarm" \
	--metric-name "NeverPublished" \
	--statistic Sum \
	--period 60 \
	--evaluation-periods 1 \
	--threshold 1 \
	--comparison-operator GreaterThanThreshold \
	--treat-missing-data notBreaching

echo "neutralised ${ALARM}"

# The delay the caller waits before running this is empirical, not contractual:
# ECS was observed rewriting the alarm ~7s into a deployment. If that timing
# ever changes our write would be silently discarded and deployments would go
# back to failing on expected 4XX with no other signal, so confirm it stuck.
# @related: ROLLBACK_ALARM_TIMING
LIVE_DESC=$(aws cloudwatch describe-alarms --alarm-names "${ALARM}" \
	--query 'MetricAlarms[0].AlarmDescription' --output text)

if [[ ${LIVE_DESC} != "${DESCRIPTION}" ]]; then
	echo "::error::alarm reverted to '${LIVE_DESC}' -- ECS rewrote it after we did"
	exit 1
fi

echo "verified: ${ALARM} is still neutralised"
