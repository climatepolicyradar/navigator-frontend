/// <reference types="cypress" />
import { clickCookiePolicy } from "../../../utils/cookiePolicy";

const URL = "document/north-sea-transition-deal_5687";

const mainDocsSelector = '[data-cy="main-documents"]';
const relatedDocsSelector = '[data-cy="related-documents"]';
const targetsSelector = '[data-cy="targets"]';

const pageSelectors = ["h1", '[data-cy="country-link"]', '[data-cy="download-target-csv"]', mainDocsSelector, relatedDocsSelector, targetsSelector];
const pageHeadings = ["Related documents", "Targets", "Timeline", "About this document", "Note"];
const metaHeadings = ["Category", "Type", "Topics", "Sectors"];

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

  it("should display the page headings", () => {
    pageHeadings.forEach((heading) => {
      cy.contains("h3", heading).should("be.visible");
    });
  });

  it("should display the metadata", () => {
    metaHeadings.forEach((heading) => {
      cy.contains("h4", heading).should("be.visible");
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
