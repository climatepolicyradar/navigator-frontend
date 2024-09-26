/// <reference types="cypress" />
import { clickCookiePolicy } from "../../../utils/cookiePolicy";

const searchInputSelector = '[data-cy="search-input"]';
const searchResultsSelector = '[data-cy="search-results"]';
const searchResultSelector = '[data-cy="search-result"]';
const searchTerm = "adaptation report";
const searchTermQueryString = "?q=adaptation+report";

describe("Search Flow", () => {
  before(() => {
    cy.visit("/");
    clickCookiePolicy();
  });

  it("should display the input, type in search", () => {
    cy.get(searchInputSelector).should("be.visible").type(searchTerm).should("have.value", searchTerm);
  });

  it("should submit the search form when enter is pressed", () => {
    cy.get(searchInputSelector).type("{enter}");
  });

  it("should now be on the search page", () => {
    cy.url().should("include", "/search");
  });

  it("should have the accurate query string value", () => {
    cy.location().should((loc) => {
      expect(loc.search).to.eq(searchTermQueryString);
      expect(loc.pathname).to.eq("/search");
    });
  });

  it("should display list of search results container", () => {
    cy.get(searchResultsSelector, { timeout: 10000 }).should("be.visible");
  });

  it("should display at least 1 result", () => {
    cy.get(searchResultsSelector).children(searchResultSelector, { timeout: 10000 }).should("have.length.gte", 1);
  });

  it("should display the correct search result attributes", () => {
    cy.get(searchResultsSelector).within(() => {
      cy.get('[data-cy="family-title"]').should("be.visible");
      cy.get('[data-cy="family-metadata-category"]').should("be.visible");
      cy.get('[data-cy="family-metadata-year"]').should("be.visible");
      cy.get('[data-cy="family-description"]').should("be.visible");
      cy.get('[data-cy="country-link"]').should("be.visible");
    });
  });

  it("should display no results if an invalid token is prvided", () => {
    cy.intercept("searches", (req) => {
      req.headers["app-token"] = "hard coded";
    });
    cy.visit("/search");
    cy.get(searchResultsSelector).children(searchResultSelector).should("have.length", 0);
  });
});
