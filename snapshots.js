/**
 * TODO: don't use data-cy selectors which couples this to cypress
 */
module.exports = [
  {
    name: "Home page - with cookie banner",
    url: "http://localhost:3000",
  },
  {
    name: "Home page - without cookie banner",
    url: "http://localhost:3000",
    execute: {
      beforeSnapshot() {
        document.querySelector("[data-cy='cookie-consent-accept']").click();
      },
    },
  },
  {
    name: "Search page",
    url: "http://localhost:3000/search?q=Adaptation+strategy",
    waitForSelector: "[data-cy='search-results']",
    execute: {
      beforeSnapshot() {
        document.querySelector("[data-cy='cookie-consent-accept']").click();
      },
    },
  },
  {
    name: "Family page",
    url: "http://localhost:3000/document/farming-forest-and-alimentation-framework-law-no-2014-1170_deba",
    execute: {
      beforeSnapshot() {
        document.querySelector("[data-cy='cookie-consent-accept']").click();
      },
    },
  },
  {
    name: "Document page",
    url: "http://localhost:3000/documents/jet-zero-strategy_a6a6?q=2050&l=united-kingdom&y=2022&y=2023",
    waitForSelector: "[id='iframe-pdf-div']",
    execute: {
      beforeSnapshot() {
        document.querySelector("[data-cy='cookie-consent-accept']").click();
      },
    },
  },
  {
    name: "Geography page",
    url: "http://localhost:3000/geographies/united-kingdom",
    execute: {
      beforeSnapshot() {
        document.querySelector("[data-cy='cookie-consent-accept']").click();
      },
    },
  },
  {
    name: "Terms of use page",
    url: "http://localhost:3000/terms-of-use",
    execute: {
      beforeSnapshot() {
        document.querySelector("[data-cy='cookie-consent-accept']").click();
      },
    },
  },
  {
    name: "Feature flags page",
    url: "http://localhost:3000/_feature-flags",
  },
];
