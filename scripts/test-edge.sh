#!/usr/bin/env bash
#
# Run the ccc-redirection function in the REAL CloudFront Functions runtime.
#
# Vitest executes this code in Node, and CloudFront's UpdateFunction only does
# shallow validation -- both accepted code the edge runtime rejects at parse
# time, which 503s every request on the distribution (2026-08-20 outage).
# TestFunction is the only faithful oracle, so this script:
#
#   1. ensures a scratch KVS exists and seeds it from the fixtures file
#   2. pushes the function code to a scratch function's DEVELOPMENT stage
#      (never published -- there is no path to live traffic)
#   3. runs every fixture through TestFunction and asserts the outcome
#
# Usage:
#   AWS_PROFILE=staging ./scripts/test-edge.sh [path/to/redirection.js]
#
# Requires: aws cli v2, jq. TestFunction is free; the scratch resources cost
# nothing at rest.

set -euo pipefail

CODE_FILE="${1:-infra/lambda_code/redirection.js}"
FIXTURES="${FIXTURES:-infra/lambda_code/edge-fixtures.json}"
FN_NAME="${FN_NAME:-edge-test-ccc-redirection}"
KVS_NAME="${KVS_NAME:-edge-test-ccc-redirection-kvs}"

[[ -f ${CODE_FILE} ]] || {
	echo "no such code file: ${CODE_FILE}" >&2
	exit 2
}
[[ -f ${FIXTURES} ]] || {
	echo "no such fixtures file: ${FIXTURES}" >&2
	exit 2
}

##############################################################################
# Scratch KVS: create if missing, wait for READY, seed fixture keys
##############################################################################

KVS_ARN=$(aws cloudfront list-key-value-stores \
	--query "KeyValueStoreList.Items[?Name=='${KVS_NAME}'].ARN" --output text)

if [[ -z ${KVS_ARN} || ${KVS_ARN} == "None" ]]; then
	echo "creating scratch KVS ${KVS_NAME}..."
	KVS_ARN=$(aws cloudfront create-key-value-store --name "${KVS_NAME}" \
		--comment "scratch store for test-edge.sh; safe to delete" \
		--query 'KeyValueStore.ARN' --output text)
fi

for _ in $(seq 30); do
	STATUS=$(aws cloudfront describe-key-value-store --name "${KVS_NAME}" \
		--query 'KeyValueStore.Status' --output text)
	[[ ${STATUS} == "READY" ]] && break
	sleep 2
done
[[ ${STATUS} == "READY" ]] || {
	echo "KVS not READY (${STATUS})" >&2
	exit 1
}

# Seed: put-key is ETag-chained, so apply sequentially.
SEED=$(jq -r '.kvsSeed | to_entries[] | "\(.key)\t\(.value)"' "${FIXTURES}")
while IFS=$'\t' read -r key value; do
	ETAG=$(aws cloudfront-keyvaluestore describe-key-value-store \
		--kvs-arn "${KVS_ARN}" --query ETag --output text)
	aws cloudfront-keyvaluestore put-key --kvs-arn "${KVS_ARN}" \
		--if-match "${ETAG}" --key "${key}" --value "${value}" >/dev/null
done <<<"${SEED}"

##############################################################################
# Scratch function: create or update the DEVELOPMENT stage. Never published.
##############################################################################

FN_CONFIG=$(jq -n --arg arn "${KVS_ARN}" '{
  Comment: "scratch function for test-edge.sh; safe to delete",
  Runtime: "cloudfront-js-2.0",
  KeyValueStoreAssociations: { Quantity: 1, Items: [{ KeyValueStoreARN: $arn }] }
}')

if aws cloudfront describe-function --name "${FN_NAME}" >/dev/null 2>&1; then
	ETAG=$(aws cloudfront describe-function --name "${FN_NAME}" \
		--query ETag --output text)
	ETAG=$(aws cloudfront update-function --name "${FN_NAME}" \
		--if-match "${ETAG}" --function-config "${FN_CONFIG}" \
		--function-code "fileb://${CODE_FILE}" --query ETag --output text)
else
	ETAG=$(aws cloudfront create-function --name "${FN_NAME}" \
		--function-config "${FN_CONFIG}" \
		--function-code "fileb://${CODE_FILE}" --query ETag --output text)
fi

##############################################################################
# Run fixtures through TestFunction and assert
##############################################################################

PASS=0
FAIL=0
MAX_CU=0

CASES=$(jq -c '.cases[]' "${FIXTURES}")
while read -r case_json; do
	uri=$(jq -r .uri <<<"${case_json}")
	expect=$(jq -r .expect <<<"${case_json}")

	EVENT=$(jq -n --arg uri "${uri}" '{
    version: "1.0",
    context: { eventType: "viewer-request" },
    viewer: { ip: "203.0.113.10" },
    request: { method: "GET", uri: $uri, headers: {}, cookies: {}, querystring: {} }
  }' | base64 -w0)

	RESULT=$(aws cloudfront test-function --name "${FN_NAME}" \
		--if-match "${ETAG}" --stage DEVELOPMENT --event-object "${EVENT}")

	ERR=$(jq -r '.TestResult.FunctionErrorMessage // ""' <<<"${RESULT}")
	CU=$(jq -r '.TestResult.ComputeUtilization // "0"' <<<"${RESULT}")
	((CU > MAX_CU)) && MAX_CU=${CU}

	if [[ -n ${ERR} ]]; then
		echo "FAIL ${uri}"
		echo "     runtime error: ${ERR}"
		FAIL=$((FAIL + 1))
		# A parse-level error fails every event identically; stop after the
		# evidence is in rather than retrying a permanently-broken function.
		if [[ ${ERR} == *SyntaxError* ]]; then
			echo "     (parse error affects all cases; stopping early)"
			break
		fi
		continue
	fi

	OUTPUT=$(jq -r '.TestResult.FunctionOutput' <<<"${RESULT}")
	if [[ ${expect} == "pass" ]]; then
		got=$(jq -r 'if has("request") then "pass" else "redirect to " + (.response.headers.location.value // "?") end' <<<"${OUTPUT}")
		want="pass"
	else
		want="redirect to $(jq -r .location <<<"${case_json}")"
		got=$(jq -r 'if has("response") then "redirect to " + (.response.headers.location.value // "?") else "pass" end' <<<"${OUTPUT}")
	fi

	if [[ ${got} == "${want}" ]]; then
		PASS=$((PASS + 1))
	else
		echo "FAIL ${uri}"
		echo "     want: ${want}"
		echo "     got:  ${got}"
		FAIL=$((FAIL + 1))
	fi
done <<<"${CASES}"

echo
echo "edge runtime: ${PASS} passed, ${FAIL} failed; peak compute utilization ${MAX_CU}/100"
((MAX_CU >= 80)) && echo "WARNING: compute utilization >= 80 -- risk of throttling at the edge"
((FAIL == 0))
