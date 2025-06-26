#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Lighthouse CI Regression Checker
 *
 * Parses Lighthouse CI comparison output and fails if any metric degrades
 * compared to the baseline branch.
 */

const fs = require("fs");
const path = require("path");

/**
 * Parse Lighthouse CI comparison data and check for regressions
 *
 * @param {string} comparisonData - JSON string containing comparison data
 * @returns {Object} Object containing regression status and details
 */
function checkForRegressions(comparisonData) {
  try {
    const data = JSON.parse(comparisonData);
    const regressions = [];

    // Check each URL's metrics
    Object.keys(data).forEach((url) => {
      const urlData = data[url];

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
function main() {
  console.log("🔍 Checking Lighthouse CI for performance regressions...");

  // Check if we're in a PR context (baseHash should be provided)
  const baseHash = process.env.LHCI_BASE_HASH;
  if (!baseHash) {
    console.log("⚠️  No base hash provided, skipping regression check");
    process.exit(0);
  }

  // Look for Lighthouse CI output files
  const lhciDir = path.join(process.cwd(), ".lighthouseci");
  if (!fs.existsSync(lhciDir)) {
    console.log("⚠️  No Lighthouse CI output found, skipping regression check");
    process.exit(0);
  }

  // Find comparison data
  const comparisonFile = path.join(lhciDir, "comparison.json");
  if (!fs.existsSync(comparisonFile)) {
    console.log("⚠️  No comparison data found, skipping regression check");
    process.exit(0);
  }

  try {
    const comparisonData = fs.readFileSync(comparisonFile, "utf8");
    const result = checkForRegressions(comparisonData);

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
    console.error("❌ Error reading Lighthouse comparison data:", error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { checkForRegressions };
