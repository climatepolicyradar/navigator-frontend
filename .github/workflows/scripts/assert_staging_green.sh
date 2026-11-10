#!/usr/bin/env bash
#
# Refuse a production deploy unless THEME's staging deploy for this exact
# commit succeeded. Fulfils the action from the 2026-10-12 SEV1, where a
# change reached all four production frontends without staging having
# verified it.
#
# Staging is deployed by the reusable deploy-staging.yml, called from
# merge_to_main.yml -- so its jobs live inside the Merge to main run for
# the commit, not in a run of their own. Find the Merge to main run for
# this SHA, then the one job within it named for this theme.
#
# The job name carries the SHA (see deploy-staging.yml's `name:`), so an
# exact match on the full name pins both commit and theme -- a prefix match
# would let another commit's green job satisfy the gate.
#
# The escape hatch for a severe incident is deliberately not here, but the
# separate "Deploy hashed image to AWS" workflow, which is ungated and
# announces the skipped staging verification in #prod-updates.
#
# Requires GH_TOKEN with actions:read.
#
# Usage: assert_staging_green.sh <sha> <theme>
#   e.g. assert_staging_green.sh 55ff5dd6... cpr

set -euo pipefail

SHA="${1:?usage: assert_staging_green.sh <sha> <theme>}"
THEME="${2:?}"

JOB_NAME="deploy-staging / Deploy ${SHA} to staging ${THEME}"

# Sweep over all runs for the SHA as a commit can be built more than
# once (a re-run, or main being pushed and re-pushed), and any one
# of those runs having deployed this theme's staging green is enough.
RUNS=$(gh api --paginate \
	"repos/${GITHUB_REPOSITORY}/actions/workflows/merge_to_main.yml/runs?head_sha=${SHA}&per_page=100" \
	--jq '.workflow_runs[].id')

if [[ -z ${RUNS} ]]; then
	echo "::error::No 'Merge to main' run found for ${SHA}, so staging has never deployed it."
	echo "::error::Commits reach production via main. If this is a hotfix during an incident,"
	echo "::error::use the 'Deploy hashed image to AWS' workflow instead."
	exit 1
fi

SEEN=""
for RUN_ID in ${RUNS}; do
	RESULT=$(gh api --paginate \
		"repos/${GITHUB_REPOSITORY}/actions/runs/${RUN_ID}/jobs?per_page=100" \
		--jq ".jobs[] | select(.name == \"${JOB_NAME}\") | \"\(.status):\(.conclusion)\"")

	if printf '%s\n' "${RESULT}" | grep -qx 'completed:success'; then
		echo "Staging deploy of ${THEME} for ${SHA} succeeded (run ${RUN_ID}). Proceeding."
		exit 0
	fi

	[[ -n ${RESULT} ]] && SEEN="${SEEN}${RESULT}"$'\n'
done
SEEN="${SEEN%$'\n'}"

RUN_URL="https://github.com/${GITHUB_REPOSITORY}/actions/workflows/merge_to_main.yml?query=${SHA}"

if [[ -z ${SEEN} ]]; then
	echo "::error::Staging never deployed ${THEME} for ${SHA}: no '${JOB_NAME}' job in any Merge to main run."
elif grep -qv '^completed:' <<<"${SEEN}"; then
	echo "::error::Staging deploy of ${THEME} for ${SHA} has not finished yet. Wait for it to go green, then re-run."
else
	echo "::error::Staging deploy of ${THEME} for ${SHA} did not succeed (${SEEN//$'\n'/, })."
fi

echo "::error::See ${RUN_URL}"
echo "::error::Production must not ship a commit staging has not verified. If this is a"
echo "::error::hotfix during a severe incident, use the 'Deploy hashed image to AWS' workflow."
exit 1
