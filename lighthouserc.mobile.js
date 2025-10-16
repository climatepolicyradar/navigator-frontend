module.exports = {
  ci: {
    collect: {
      url: [
        "http://localhost:3000/",
        "http://localhost:3000/search",
        "http://localhost:3000/geographies/chile",
        "http://localhost:3000/document/climate-change-2022-impacts-adaptation-and-vulnerability_1f01", // family
        "http://localhost:3000/documents/update-of-the-national-hydrogen-strategy-d2a6", // document
      ],
      startServerCommand: "npm run start",
    },
    upload: {
      target: "lhci",
      serverBaseUrl: "https://lhci.staging.climatepolicyradar.org/",
      token: "b68259a3-808c-4c71-84c0-ae91a43e0d9d",
    },
    assert: {
      assertions: {
        // Mobile typically has worse performance, so we set lower thresholds
        // Lighthouse runs 3 times by default, so this checks each time whether the score is above the threshold.
        // If the highest result of the 3 runs is below the threshold, the build will fail [error].
        "categories:performance": ["error", { minScore: 0.2 }],
        "categories:accessibility": ["error", { minScore: 0.67 }],
        "categories:best-practices": ["error", { minScore: 0.75 }],
        "categories:seo": ["error", { minScore: 0.6 }],
      },
    },
  },
};
