#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Lighthouse CI Regression Checker
 *
 * Fetches comparison data from Lighthouse CI server and fails if any metric degrades
 * compared to the baseline branch.
 */

const fs = require("fs");
const http = require("http");
const https = require("https");
const path = require("path");

/**
 * Make HTTP request to fetch data
 *
 * @param {string} url - URL to fetch
 * @returns {Promise<string>} Response data
 */
function fetchData(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https:") ? https : http;

    client
      .get(url, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          if (res.statusCode === 200) {
            resolve(data);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
          }
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

/**
 * Parse Lighthouse CI comparison data and check for regressions
 *
 * @param {Object} comparisonData - Comparison data from Lighthouse server
 * @returns {Object} Object containing regression status and details
 */
function checkForRegressions(comparisonData) {
  try {
    const regressions = [];

    // Check each URL's metrics
    Object.keys(comparisonData).forEach((url) => {
      const urlData = comparisonData[url];

      // Check category scores
      if (urlData.categories) {
        Object.keys(urlData.categories).forEach((category) => {
          const categoryData = urlData.categories[category];
          if (categoryData.score && categoryData.score.diff < 0) {
            regressions.push({
              url,
              metric: `categories.${category}`,
              baseline: categoryData.score.baseline,
              current: categoryData.score.current,
              diff: categoryData.score.diff,
            });
          }
        });
      }

      // Check individual metrics
      if (urlData.metrics) {
        Object.keys(urlData.metrics).forEach((metric) => {
          const metricData = urlData.metrics[metric];
          if (metricData.diff < 0) {
            regressions.push({
              url,
              metric,
              baseline: metricData.baseline,
              current: metricData.current,
              diff: metricData.diff,
            });
          }
        });
      }
    });

    return {
      hasRegressions: regressions.length > 0,
      regressions,
    };
  } catch (error) {
    console.error("❌ Error parsing Lighthouse comparison data:", error.message);
    process.exit(1);
  }
}

/**
 * Main function to run the regression check
 */
async function main() {
  console.log("🔍 Checking Lighthouse CI for performance regressions...");

  // Check if we're in a PR context (baseHash should be provided)
  const baseHash = process.env.LHCI_BASE_HASH;
  if (!baseHash) {
    console.log("⚠️  No base hash provided, skipping regression check");
    process.exit(0);
  }

  // Get Lighthouse server details from environment or config
  const serverBaseUrl = process.env.LHCI_SERVER_BASE_URL || "http://ec2-54-217-16-2.eu-west-1.compute.amazonaws.com:9001";
  const projectId = process.env.LHCI_PROJECT_ID || "lighthouse-ci-server";
  const buildId = process.env.LHCI_BUILD_ID;

  if (!buildId) {
    console.log("⚠️  No build ID found, skipping regression check");
    process.exit(0);
  }

  try {
    // Fetch comparison data from Lighthouse server
    const comparisonUrl = `${serverBaseUrl}/api/projects/${projectId}/builds/${buildId}/comparison`;
    console.log(`📡 Fetching comparison data from: ${comparisonUrl}`);

    const comparisonData = await fetchData(comparisonUrl);
    const result = checkForRegressions(JSON.parse(comparisonData));

    if (result.hasRegressions) {
      console.error("❌ Performance regressions detected:");
      result.regressions.forEach((regression) => {
        const diffPercent = (regression.diff * 100).toFixed(2);
        console.error(`   ${regression.url} - ${regression.metric}: ${diffPercent}% degradation`);
        console.error(`     Baseline: ${regression.baseline}, Current: ${regression.current}`);
      });
      console.error("\n🚫 Build failed due to performance regressions");
      process.exit(1);
    } else {
      console.log("✅ No performance regressions detected");
      process.exit(0);
    }
  } catch (error) {
    console.error("❌ Error fetching Lighthouse comparison data:", error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main().catch((error) => {
    console.error("❌ Script failed:", error.message);
    process.exit(1);
  });
}

module.exports = { checkForRegressions };
