/// <reference types="cypress" />
import { clickCookiePolicy } from "../../../utils/cookiePolicy";

const URL = "documents/jet-zero-strategy_a6a6?q=2050&l=united-kingdom&y=2022&y=2023";

const pageSelectors = ["h1", '[data-cy="country-link"]', '[data-cy="view-source"]', "#passage-matches", "#pdf-div"];

const breadcrumbSelectors = [
  "[data-cy='breadcrumbs']",
  "[data-cy='breadcrumb home']",
  "[data-cy='breadcrumb category']",
  "[data-cy='breadcrumb family']",
  "[data-cy='breadcrumb current']",
];

describe("Document Page", () => {
  before(() => {
    cy.visit(URL);
    clickCookiePolicy();
  });

  it("should load the document page", () => {
    cy.location("pathname").should("include", "/documents");
  });

  it("should have the correct page title", () => {
    cy.title().should("include", "Jet zero strategy");
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

  it("should display the matches heading", () => {
    cy.contains("h3", "Document matches for").should("be.visible");
  });

  it("should contain at least 1 passage match", () => {
    cy.get("#passage-matches").children().should("have.length.greaterThan", 0);
  });
});
