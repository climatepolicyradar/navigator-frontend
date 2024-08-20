/// <reference types="cypress" />
import { clickCookiePolicy } from "../../../utils/cookiePolicy";

const geoUrl = "/geographies/united-kingdom";
const geoBadUrl = "this-should-not-exist";

const pageSelectors = [
  "h1",
  "[data-cy='region']",
  '[data-cy="political-group"]',
  '[data-cy="world-bank-income-group"]',
  '[data-cy="global-climate-risk-index"]',
  '[data-cy="share-of-global-emissions"]',
  '[data-cy="top-documents"]',
  '[data-cy="see-more-button"]',
  '[data-cy="legislative-process"]',
  '[data-cy="targets"]',
  '[data-cy="download-target-csv"]',
];

describe("Geography Page", () => {
  before(() => {
    cy.visit(geoUrl);
    cy.intercept("/*", (req) => {
      req.headers["app-token"] = process.env.NEXT_PUBLIC_APP_TOKEN;
    });
    clickCookiePolicy();
  });

  it("should be on the search page", () => {
    cy.location("pathname").should("eq", geoUrl);
  });

  it("should not have any query string values", () => {
    cy.url().should("not.include", "?");
  });

  it("should display correct page elements", () => {
    pageSelectors.forEach((selector) => {
      cy.get(selector).should("be.visible");
    });
  });

  it("should display the map on wider screens", () => {
    cy.get('[data-cy="map"]').should("be.visible");
  });

  it("should not display the map on smaller screens", () => {
    cy.viewport("ipad-2");
    cy.get('[data-cy="map"]').should("not.be.visible");
  });

  it("should return a 404 if no geography is found", () => {
    cy.request({ url: geoBadUrl, failOnStatusCode: false }).its("status").should("equal", 404);
    cy.visit(geoBadUrl, { failOnStatusCode: false });
    // Without resetting the page Cypress and Next may get stuck in a GET loop
    cy.visit(geoUrl);
  });

  it("should return a 404 if 'no geography'", () => {
    cy.request({ url: "/geographies/xaa", failOnStatusCode: false }).its("status").should("equal", 404);
    // Without resetting the page Cypress and Next may get stuck in a GET loop
    cy.visit(geoUrl);
  });

  it("should return a 404 if 'international'", () => {
    cy.request({ url: "/geographies/xab", failOnStatusCode: false }).its("status").should("equal", 404);
    // Without resetting the page Cypress and Next may get stuck in a GET loop
    cy.visit(geoUrl);
  });
});
