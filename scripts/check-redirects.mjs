#!/usr/bin/env node
/**
 * Live-checks a theme's redirects.json against a running environment
 * (local, a PR review stack, staging, or production): confirms each
 * static redirect returns the expected status, follows the chain to a
 * final 200, and flags cyclical chains along the way.
 *
 * Usage:
 *   node scripts/check-redirects.mjs --base-url https://app.climatepolicyradar.org [--file themes/cpr/redirects.json] [--concurrency 15] [--max-hops 10]
 */
import { readFileSync } from "node:fs";
import { parseArgs } from "node:util";

const { values } = parseArgs({
  options: {
    "base-url": { type: "string" },
    file: { type: "string", default: "themes/cpr/redirects.json" },
    concurrency: { type: "string", default: "15" },
    "max-hops": { type: "string", default: "10" },
  },
});

if (!values["base-url"]) {
  console.error("Usage: node scripts/check-redirects.mjs --base-url <url> [--file themes/cpr/redirects.json] [--concurrency 15] [--max-hops 10]");
  process.exit(1);
}

const baseUrl = values["base-url"].replace(/\/$/, "");
const concurrency = Number(values.concurrency);
const maxHops = Number(values["max-hops"]);

const rules = JSON.parse(readFileSync(values.file, "utf-8"));

// Header-conditioned (`has`/`missing`) and dynamic (`:param`) rules aren't
// exercised here - a plain URL value to be meaningfully.
// They're still covered by the static cycle check in next.config.test.ts.
const isCheckable = (rule) => !rule.has && !rule.missing && !rule.source.includes(":");

const checkable = rules.filter(isCheckable);
const skipped = rules.length - checkable.length;

async function headManual(url) {
  const res = await fetch(url, { method: "HEAD", redirect: "manual" });
  return { status: res.status, location: res.headers.get("location") };
}

async function checkRule(rule) {
  const expectedStatus = rule.permanent ? 308 : 307;
  let current = baseUrl + rule.source;
  const visited = new Set();

  for (let hop = 0; hop <= maxHops; hop++) {
    if (visited.has(current)) {
      return { rule, ok: false, reason: `cyclical redirect: ${[...visited, current].join(" -> ")}` };
    }
    visited.add(current);

    let result;
    try {
      result = await headManual(current);
    } catch (err) {
      return { rule, ok: false, reason: `request failed for ${current}: ${err.message}` };
    }

    if (hop === 0 && result.status !== expectedStatus) {
      return { rule, ok: false, reason: `expected ${expectedStatus} at ${rule.source}, got ${result.status}` };
    }

    if (result.status >= 300 && result.status < 400) {
      if (!result.location) {
        return { rule, ok: false, reason: `redirect at ${current} had no location header` };
      }
      current = new URL(result.location, current).toString();
      continue;
    }

    if (result.status === 200) {
      return { rule, ok: true };
    }

    return { rule, ok: false, reason: `chain from ${rule.source} ended at ${current} with status ${result.status}` };
  }

  return { rule, ok: false, reason: `exceeded ${maxHops} hops starting from ${rule.source}` };
}

async function runPool(items, worker, limit) {
  const results = new Array(items.length);
  let index = 0;

  async function next() {
    while (index < items.length) {
      const i = index++;
      results[i] = await worker(items[i]);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, next));
  return results;
}

const startedAt = Date.now();
console.log(
  `Checking ${checkable.length} redirects against ${baseUrl} (skipping ${skipped} dynamic/conditional entries), concurrency=${concurrency}`
);

const results = await runPool(checkable, checkRule, concurrency);

const failures = results.filter((r) => !r.ok);
const elapsedSec = ((Date.now() - startedAt) / 1000).toFixed(1);

console.log(`\nChecked ${results.length} in ${elapsedSec}s: ${results.length - failures.length} ok, ${failures.length} failed`);

if (failures.length > 0) {
  console.log("\nFailures:");
  for (const f of failures.slice(0, 50)) {
    console.log(`  ${f.rule.source} -> ${f.rule.destination}: ${f.reason}`);
  }
  if (failures.length > 50) {
    console.log(`  ... and ${failures.length - 50} more`);
  }
  process.exit(1);
}
