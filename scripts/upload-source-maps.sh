#!/usr/bin/env bash
#
# Upload client-side source maps to Grafana Faro.
#
# `productionBrowserSourceMaps: true` (next.config.js) makes Next.js emit and
# publicly serve .next/static/**/*.map -- fine for Faro to fetch during
# upload, not fine to ship in the final image (it de-minifies our JS for
# anyone). faro-cli deletes each map immediately after it uploads (or after a
# failed attempt), so nothing further to clean up here.
#
# Skips silently (build still succeeds) if credentials aren't set, so local
# and credential-less CI builds are unaffected.
#
# Usage: ./scripts/upload-source-maps.sh <static-dir> <app-name> <bundle-id>
#   e.g. ./scripts/upload-source-maps.sh .next/static cpr-frontend $GITHUB_SHA

set -euo pipefail

STATIC_DIR="${1:?usage: upload-source-maps.sh <static-dir> <app-name> <bundle-id>}"
APP_NAME="${2:?usage: upload-source-maps.sh <static-dir> <app-name> <bundle-id>}"
BUNDLE_ID="${3:?usage: upload-source-maps.sh <static-dir> <app-name> <bundle-id>}"

if [[ -z ${FARO_SOURCEMAP_API_KEY-} || -z ${FARO_SOURCEMAP_APP_ID-} || -z ${FARO_SOURCEMAP_STACK_ID-} ]]; then
	echo "Faro source map credentials not set; skipping upload (maps left in place for local debugging)."
	exit 0
fi

[[ -d ${STATIC_DIR} ]] || {
	echo "no such directory: ${STATIC_DIR}" >&2
	exit 2
}

npx --yes @grafana/faro-cli upload \
	--endpoint "https://faro-api-prod-gb-south-0.grafana.net/faro/api/v1" \
	--app-id "${FARO_SOURCEMAP_APP_ID}" \
	--api-key "${FARO_SOURCEMAP_API_KEY}" \
	--stack-id "${FARO_SOURCEMAP_STACK_ID}" \
	--app-name "${APP_NAME}" \
	--bundle-id "${BUNDLE_ID}" \
	--output-path "${STATIC_DIR}" \
	--recursive \
	--gzip-contents \
	--verbose
