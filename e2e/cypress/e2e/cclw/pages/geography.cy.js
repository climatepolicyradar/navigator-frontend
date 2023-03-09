/// <reference types="cypress" />
import { clickCookiePolicy } from "../../../utils/cookiePolicy";

const GEO_URL = "/geographies/united-kingdom";
const GEO_BAD_URL = "this-should-not-exist";

const GEO_PAGE_ELEMENTS = {
  title: "h1",
  region: "[data-cy='region']",
  politicalGroup: '[data-cy="political-group"]',
  WBIG: '[data-cy="world-bank-income-group"]',
  GCRI: '[data-cy="global-climate-risk-index"]',
  SoGE: '[data-cy="share-of-global-emissions"]',
  topDocuments: '[data-cy="top-documents"]',
  seeMoreButton: '[data-cy="see-more-button"]',
  legislativeProcess: '[data-cy="legislative-process"]',
};

describe("Geography Page", () => {
  before(() => {
    cy.visit(GEO_URL);
    clickCookiePolicy();
  });

  it("should be on the search page", () => {
    cy.location("pathname").should("eq", GEO_URL);
  });

  it("should not have any query string values", () => {
    cy.url().should("not.include", "?");
  });

  it("should display correct page elements", () => {
    for (const [_, value] of Object.entries(GEO_PAGE_ELEMENTS)) {
      cy.get(value).should("be.visible");
    }
  });

  it("should display the map on wider screens", () => {
    cy.get('[data-cy="map"]').should("be.visible");
  });

  it("should not display the map on smaller screens", () => {
    cy.viewport("ipad-2");
    cy.get('[data-cy="map"]').should("not.be.visible");
  });

  it("should return a 404 if no geography is found", () => {
    cy.request({ url: GEO_BAD_URL, failOnStatusCode: false }).its("status").should("equal", 404);
    cy.visit(GEO_BAD_URL, { failOnStatusCode: false });
    // Without resetting the page Cypress and Next may get stuck in a GET loop
    cy.visit(GEO_URL);
  });
});
