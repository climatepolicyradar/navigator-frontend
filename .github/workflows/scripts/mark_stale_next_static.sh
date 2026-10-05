#!/usr/bin/env bash
#
# Tags the /_next/static assets of the build a deploy just superseded, so the
# bucket's `expire-stale-builds` lifecycle rule can reclaim them after its grace
# period (see infra/resources/next_static_bucket.py).
#
# Why tagging rather than an age-based lifecycle rule on its own: S3 expiry is
# by object age, not last access, so an age-only rule deletes the live build's
# assets during any quiet spell longer than its window, and CloudFront has no
# failover origin for /_next/static/* -- every chunk 404s and the site breaks.
# Only CI knows which assets are still live, so only CI can mark the rest.
#
# Must run *after* the ECS rollout succeeds, not after the upload: until then
# the previous build is still serving traffic, and tagging its assets would put
# the live site's chunks on the delete list. Being a separate step is what
# enforces that -- a failed rollout fails the job and this never runs.
#
# Depends on the deploy having re-uploaded every asset of the build going live
# (`aws s3 cp --recursive`, not `aws s3 sync`). A PUT replaces an object's tag
# set, so re-uploading is what clears `stale` off assets carried into the new
# build; anything sync skipped would keep a stale tag and be deleted while live.
#
# Usage: mark_stale_next_static.sh <bucket> <uploaded-after>
#   uploaded-after  RFC3339 UTC, captured immediately before the upload step
set -euo pipefail

BUCKET_NAME="${1:?bucket name required}"
UPLOADED_STATIC_ASSETS_AT="${2:?uploaded-after timestamp required}"

PREFIX="_next/static/"
# Must match the tag the expire-stale-builds rule filters on in
# infra/resources/next_static_bucket.py, or that rule matches nothing and the
# bucket grows without bound.
TAGGING='TagSet=[{Key=stale,Value=true}]'

UPPER_EPOCH=$(date -u -d "$UPLOADED_STATIC_ASSETS_AT" +%s)

# Every run sweeps the whole prefix, so most objects get re-tagged with the tag
# they already carry. That is a wasted PUT, not a correctness problem: expiry
# counts from LastModified, not from when the tag was written, so re-tagging
# cannot keep a stale object alive. At a few hundred objects a deploy it costs
# single-digit dollars a year -- less than tracking a watermark to skip them.
# Sweeping unconditionally also means a deploy that dies before this step
# strands nothing: the next one picks its objects up.
STALE_KEYS=$(mktemp)
trap 'rm -f "$STALE_KEYS"' EXIT

# Objects this deploy re-uploaded are stamped at or after UPLOADED_STATIC_ASSETS_AT, so the
# upper bound is what separates the build going live from the one it replaced.
# LastModified comes back as 2026-09-30T12:34:56+00:00, which fromdateiso8601
# will not parse without the offset rewritten to Z.
aws s3api list-objects-v2 \
	--bucket "$BUCKET_NAME" \
	--prefix "$PREFIX" \
	--query 'Contents[].{k: Key, t: LastModified}' \
	--output json |
	jq -r --argjson hi "$UPPER_EPOCH" '
		.[]?
		| (.t | sub("\\+00:00$"; "Z") | fromdateiso8601) as $modified
		| select($modified < $hi)
		| .k
	' >"$STALE_KEYS"

COUNT=$(wc -l <"$STALE_KEYS")
if [ "$COUNT" -gt 0 ]; then
	# -I reads whole lines, so keys containing spaces survive. A failure here
	# exits non-zero and fails the job; the next deploy re-tags the same
	# objects, so a partial pass costs nothing but the retry.
	xargs -a "$STALE_KEYS" -P 16 -I {} \
		aws s3api put-object-tagging \
		--bucket "$BUCKET_NAME" \
		--key {} \
		--tagging "$TAGGING" >/dev/null
fi
echo "tagged ${COUNT} superseded object(s) stale in ${BUCKET}"
