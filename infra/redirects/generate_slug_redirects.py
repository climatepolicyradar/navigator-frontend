"""Redirect superseded document slugs to the current one.

A family or physical document accumulates a new slug row each time it is
re-ingested under a changed title, but only the newest slug resolves. Every
older slug 404s, so each one gets a redirect to the newest slug sharing its
import id.

Input is a CSV dump of the slug table -- see README.md for the psql command.
Output is a kv_list_json file in the shape the redirects stack expects, plus a
review file listing the groups this script refuses to decide.

    python generate_slug_redirects.py slugs.csv

"Newest" is max(created). When a group's newest timestamp is shared by more
than one slug the bulk import wrote them in the same transaction, so there is
no signal for which one is live -- picking wrong would 301 a working URL onto
a different document. Those groups go to the review file untouched.
"""

import csv
import json
import sys
from collections import defaultdict
from datetime import datetime
from pathlib import Path

INFRA_DIR = Path(__file__).parent
OUTPUT_JSON = INFRA_DIR / "lambdas" / "cpr.json"
REVIEW_JSON = INFRA_DIR / "lambdas" / "cpr.review.json"

# Which page serves a slug depends on what it points at.
# @see src/pages/document/[id].tsx and src/pages/documents/[id].tsx
ROUTES = {
    "family_import_id": "/document/",
    "family_document_import_id": "/documents/",
}

# CloudFront KeyValueStore limits, per resource.
# @see https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cloudfront-key-value-store.html
MAX_KEY_BYTES = 512
MAX_VALUE_BYTES = 1024
MAX_STORE_BYTES = 5 * 1024 * 1024


def group_by_import_id(rows):
    """Bucket slug rows under the (column, import id) they resolve to.

    A row carries exactly one of the two import id columns; rows carrying
    neither point at a collection and have no document route, so they are
    dropped.
    """
    groups = defaultdict(list)

    for row in rows:
        for column in ROUTES:
            import_id = (row.get(column) or "").strip()
            if import_id:
                groups[(column, import_id)].append(
                    {"name": row["name"].strip(), "created": datetime.fromisoformat(row["created"])}
                )
                break

    return groups


def resolve(slugs):
    """Split a group into (newest slug, superseded slugs).

    Returns (None, []) when the newest timestamp is not unique -- see the
    module docstring on why a tie is not a decision this script can make.
    """
    newest = max(slug["created"] for slug in slugs)
    winners = [slug for slug in slugs if slug["created"] == newest]

    if len(winners) != 1:
        return None, []

    return winners[0], [slug for slug in slugs if slug is not winners[0]]


def build_redirects(groups):
    redirects = {}
    tied = []

    for (column, import_id), slugs in groups.items():
        if len(slugs) < 2:
            continue

        winner, superseded = resolve(slugs)

        if winner is None:
            tied.append(
                {
                    "importId": import_id,
                    "column": column,
                    "slugs": sorted(slug["name"] for slug in slugs),
                }
            )
            continue

        route = ROUTES[column]
        for slug in superseded:
            redirects[route + slug["name"]] = route + winner["name"]

    return redirects, tied


def check(redirects):
    """Report anything that would break the KVS upload or loop at the edge."""
    warnings = []

    for key, value in sorted(redirects.items()):
        if len(key.encode()) > MAX_KEY_BYTES:
            warnings.append(f"key over {MAX_KEY_BYTES} bytes: {key}")
        if len(value.encode()) > MAX_VALUE_BYTES:
            warnings.append(f"value over {MAX_VALUE_BYTES} bytes: {value}")
        if key == value:
            warnings.append(f"self-redirect: {key}")
        # A destination that is itself redirected chains 301s. Disjoint groups
        # should make this impossible, so treat it as a broken assumption.
        if value in redirects:
            warnings.append(f"chained redirect: {key} -> {value} -> {redirects[value]}")

    size = len(json.dumps([{"Key": k, "Value": v} for k, v in redirects.items()]).encode())
    if size > MAX_STORE_BYTES:
        warnings.append(f"store is {size} bytes, over the {MAX_STORE_BYTES} byte limit")

    return warnings


def main(csv_path):
    with open(csv_path, newline="") as f:
        rows = list(csv.DictReader(f))

    groups = group_by_import_id(rows)
    redirects, tied = build_redirects(groups)
    warnings = check(redirects)

    payload = {"redirects": [{"Key": k, "Value": v} for k, v in sorted(redirects.items())]}
    OUTPUT_JSON.write_text(json.dumps(payload, indent=2) + "\n")
    REVIEW_JSON.write_text(json.dumps({"tied": sorted(tied, key=lambda g: g["importId"])}, indent=2) + "\n")

    duplicated = sum(1 for slugs in groups.values() if len(slugs) > 1)
    print(f"{len(rows)} rows, {len(groups)} import ids, {duplicated} with more than one slug")
    print(f"{len(redirects)} redirects -> {OUTPUT_JSON}")
    print(f"{len(tied)} groups tied on created, skipped -> {REVIEW_JSON}")

    for warning in warnings:
        print(f"WARNING: {warning}", file=sys.stderr)

    return 1 if warnings else 0


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit("usage: python generate_slug_redirects.py <slugs.csv>")
    sys.exit(main(sys.argv[1]))
