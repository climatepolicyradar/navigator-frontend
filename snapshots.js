module.exports = [
  {
    name: "Home page - with cookie banner",
    url: "http://localhost:3000",
    waitForSelector: "[aria-label='Search term']",
  },
  {
    name: "Search page",
    url: "http://localhost:3000/search?q=Adaptation+strategy",
    waitForSelector: "[aria-label='Search results']",
    execute: {
      beforeSnapshot() {
        [...document.querySelectorAll("button")].find((btn) => btn.textContent.trim() === "Accept cookies")?.click();
      },
    },
  },
  {
    name: "Family page",
    url: "http://localhost:3000/document/farming-forest-and-alimentation-framework-law-no-2014-1170_deba",
    execute: {
      beforeSnapshot() {
        [...document.querySelectorAll("button")].find((btn) => btn.textContent.trim() === "Accept cookies")?.click();
      },
    },
  },
  {
    name: "Document page",
    url: "http://localhost:3000/documents/jet-zero-strategy_a6a6?q=2050&l=united-kingdom&y=2022&y=2023",
    waitForSelector: "[id='iframe-pdf-div']",
    execute: {
      beforeSnapshot() {
        [...document.querySelectorAll("button")].find((btn) => btn.textContent.trim() === "Accept cookies")?.click();
      },
    },
  },
  {
    name: "Geography page",
    url: "http://localhost:3000/geographies/united-kingdom",
    execute: {
      beforeSnapshot() {
        [...document.querySelectorAll("button")].find((btn) => btn.textContent.trim() === "Accept cookies")?.click();
      },
    },
  },
  {
    name: "Terms of use page",
    url: "http://localhost:3000/terms-of-use",
    execute: {
      beforeSnapshot() {
        [...document.querySelectorAll("button")].find((btn) => btn.textContent.trim() === "Accept cookies")?.click();
      },
    },
  },
  {
    name: "FAQ page",
    url: "http://localhost:3000/faq",
    execute: {
      beforeSnapshot() {
        [...document.querySelectorAll("button")].find((btn) => btn.textContent.trim() === "Accept cookies")?.click();
      },
    },
  },
];
