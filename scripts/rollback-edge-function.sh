#!/usr/bin/env bash
#
# Emergency rollback for the ccc-redirection CloudFront function.
#
# Republishes a known-good version of infra/lambda_code/redirection.js
# straight to the LIVE stage, bypassing the deploy pipeline. Propagates
# globally in seconds. Used to recover the 2026-08-20 outage (503
# FunctionExecutionError on every www.climatecasechart.com request).
#
# Usage (prod write credentials required):
#   AWS_PROFILE=prod ./scripts/rollback-edge-function.sh [git-ref]
#
# git-ref defaults to LAST_KNOWN_GOOD below. Update that pin when a newer
# version has proven itself in production.
#
# After running: production now differs from pulumi state. The next deploy
# republishes whatever is on main — so if main caused the incident, pair
# this with a revert or fix on main, or the next deploy re-breaks the site.

set -euo pipefail

# Pre-#1494 version: in production unchanged for months before 2026-08-20.
LAST_KNOWN_GOOD="2c649c40"

REF="${1:-${LAST_KNOWN_GOOD}}"
FN_NAME="ccc-redirection"
PROD_ACCOUNT="532586131621"
# Must match the function config in infra/__main__.py (is_ccc_stack block),
# or the rollback itself introduces config drift beyond the code.
KVS_ARN="arn:aws:cloudfront::532586131621:key-value-store/8074500c-7ab4-49df-9234-523b63d63fa1"

ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
if [[ ${ACCOUNT} != "${PROD_ACCOUNT}" ]]; then
	echo "refusing to run: credentials are for account ${ACCOUNT}, not production (${PROD_ACCOUNT})" >&2
	exit 1
fi

CODE_TMP=$(mktemp /tmp/redirection-rollback-XXXX.js)
trap 'rm -f "${CODE_TMP}"' EXIT
git show "${REF}:infra/lambda_code/redirection.js" >"${CODE_TMP}"
BYTES=$(wc -c <"${CODE_TMP}")
echo "rolling back ${FN_NAME} to ${REF} (${BYTES} bytes)"

ETAG=$(aws cloudfront describe-function --name "${FN_NAME}" --query ETag --output text)
NEWETAG=$(aws cloudfront update-function --name "${FN_NAME}" --if-match "${ETAG}" \
	--function-config "{\"Comment\":\"climatecasechart.com redirection function\",\"Runtime\":\"cloudfront-js-2.0\",\"KeyValueStoreAssociations\":{\"Quantity\":1,\"Items\":[{\"KeyValueStoreARN\":\"${KVS_ARN}\"}]}}" \
	--function-code "fileb://${CODE_TMP}" --query ETag --output text)
aws cloudfront publish-function --name "${FN_NAME}" --if-match "${NEWETAG}" >/dev/null
echo "published; polling homepage for recovery..."

for i in $(seq 12); do
	sleep 5
	CODE=$(curl -s -o /dev/null -w '%{http_code}' -A 'rollback-verify' https://www.climatecasechart.com/ || echo 000)
	echo "  t+$((i * 5))s  homepage ${CODE}"
	[[ ${CODE} == "200" ]] && {
		echo "recovered"
		exit 0
	}
done
echo "homepage still not 200 after 60s -- function may not be the (only) problem" >&2
exit 1
