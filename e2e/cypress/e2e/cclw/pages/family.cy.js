/// <reference types="cypress" />
import { clickCookiePolicy } from "../../../utils/cookiePolicy";

const URL = "document/north-sea-transition-deal_5687";

const mainDocsSelector = '[data-cy="main-documents"]';
const relatedDocsSelector = '[data-cy="related-documents"]';
const targetsSelector = '[data-cy="targets"]';

const pageSelectors = ["h1", '[data-cy="country-link"]', '[data-cy="download-target-csv"]', mainDocsSelector, relatedDocsSelector, targetsSelector];
const pageHeadings = ["Main documents", "Related documents", "Targets", "Timeline", "Note"];
const metaData = [
  '[data-cy="family-metadata-category"], [data-cy="family-metadata-year"], [data-cy="country-link"], [data-cy="family-metadata-topics"]',
];

const breadcrumbSelectors = [
  "[data-cy='breadcrumbs']",
  "[data-cy='breadcrumb home']",
  "[data-cy='breadcrumb category']",
  "[data-cy='breadcrumb current']",
];

describe("Family Page", () => {
  before(() => {
    cy.visit(URL);
    clickCookiePolicy();
  });

  it("should load the family page", () => {
    cy.location("pathname").should("include", "/document");
  });

  it("should not have any query string values", () => {
    cy.url().should("not.include", "?");
  });

  it("should have the correct page title", () => {
    cy.title().should("include", "North Sea Transition Deal");
  });

  it("should display the page elements", () => {
    pageSelectors.forEach((selector) => {
      cy.get(selector).should("be.visible");
    });
  });

  it("should display the breadcrumbs", () => {
    breadcrumbSelectors.forEach((selector) => {
      cy.get(selector).should("be.visible");
    });
  });

  it("should display the page headings", () => {
    pageHeadings.forEach((heading) => {
      cy.contains("h2", heading).should("be.visible");
    });
  });

  it("should display the metadata", () => {
    metaData.forEach((meta) => {
      cy.get(meta).should("be.visible");
    });
  });

  it("should contain at least 1 main document", () => {
    cy.get(mainDocsSelector).children().should("have.length.greaterThan", 0);
  });

  it("should contain at least 1 related document", () => {
    cy.get(relatedDocsSelector).children().should("have.length.greaterThan", 0);
  });

  it("should contain at least 1 target", () => {
    cy.get(targetsSelector).children().should("have.length.greaterThan", 0);
  });
});
