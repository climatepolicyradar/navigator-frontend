#!/usr/bin/env bash
#
# Upload client-side source maps to Grafana Faro.
#
# Runs *after* the deploy, from the composite action beside this file, not
# inside the image build. A Faro outage must never block a release: the maps
# only make stack traces readable in Faro, they have no runtime effect, so
# every failure path here exits 0 and leaves a warning in the job log.
#
# The bundle ID is the commit SHA, which the app reports as app.version at
# runtime (src/components/FrontendObservability.tsx). It isn't derived from
# build-time state, so uploading later still correlates correctly.
#
# Skips silently if credentials aren't set, so local and credential-less CI
# builds are unaffected.
#
# Usage: ./upload-source-maps.sh <maps-dir> <app-name> <bundle-id>
#   e.g. ./upload-source-maps.sh ./next-sourcemaps cpr-frontend $GITHUB_SHA

set -uo pipefail

MAPS_DIR="${1:?usage: upload-source-maps.sh <maps-dir> <app-name> <bundle-id>}"
APP_NAME="${2:?usage: upload-source-maps.sh <maps-dir> <app-name> <bundle-id>}"
BUNDLE_ID="${3:?usage: upload-source-maps.sh <maps-dir> <app-name> <bundle-id>}"

# Uploading all maps in one request is what timed out against a degraded Faro
# (FUS-761): 55 files went up as a single chunk and hit a gateway timeout.
FARO_BATCH_SIZE="${FARO_BATCH_SIZE:-10}"
FARO_MAX_ATTEMPTS="${FARO_MAX_ATTEMPTS:-3}"

warn() { echo "::warning title=Faro source maps::$*"; }

if [[ -z ${FARO_SOURCEMAP_API_KEY-} || -z ${FARO_SOURCEMAP_APP_ID-} || -z ${FARO_SOURCEMAP_STACK_ID-} ]]; then
	echo "Faro source map credentials not set; skipping upload."
	exit 0
fi

if [[ ! -d ${MAPS_DIR} ]]; then
	warn "no such directory: ${MAPS_DIR}; skipping upload."
	exit 0
fi

found_map=$(find "${MAPS_DIR}" -name '*.map' -print -quit) || true
if [[ -z ${found_map} ]]; then
	warn "no .map files under ${MAPS_DIR}; skipping upload."
	exit 0
fi

for attempt in $(seq 1 "${FARO_MAX_ATTEMPTS}"); do
	# --keep-sourcemaps: deleting them is this script's job only when it owned
	# the build directory. Here the caller owns the temp dir and discards it.
	if npx --yes @grafana/faro-cli upload \
		--endpoint "https://faro-api-prod-gb-south-0.grafana.net/faro/api/v1" \
		--app-id "${FARO_SOURCEMAP_APP_ID}" \
		--api-key "${FARO_SOURCEMAP_API_KEY}" \
		--stack-id "${FARO_SOURCEMAP_STACK_ID}" \
		--app-name "${APP_NAME}" \
		--bundle-id "${BUNDLE_ID}" \
		--output-path "${MAPS_DIR}" \
		--recursive \
		--keep-sourcemaps \
		--gzip-contents \
		--batch-size "${FARO_BATCH_SIZE}" \
		--verbose; then
		echo "Faro source map upload succeeded for ${APP_NAME} @ ${BUNDLE_ID}."
		exit 0
	fi

	if ((attempt < FARO_MAX_ATTEMPTS)); then
		backoff=$((attempt * 10))
		warn "upload attempt ${attempt}/${FARO_MAX_ATTEMPTS} failed; retrying in ${backoff}s."
		sleep "${backoff}"
	fi
done

# Deliberately exit 0: stack traces for this build won't be de-minified in
# Faro, which is an observability gap, not a reason to fail a shipped deploy.
warn "upload failed after ${FARO_MAX_ATTEMPTS} attempts for ${APP_NAME} @ ${BUNDLE_ID}. Stack traces for this build will not be de-minified in Faro. Check https://status.grafana.com/"
exit 0
