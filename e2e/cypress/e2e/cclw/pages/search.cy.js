/// <reference types="cypress" />
import { clickCookiePolicy } from "../../../utils/cookiePolicy";
const searchResultsSelector = '[data-cy="search-results"]';

describe("Search Page", () => {
  before(() => {
    cy.visit("/search");
    clickCookiePolicy();
  });

  it("should be on the search page", () => {
    cy.location("pathname").should("eq", "/search");
  });

  it("should not have any query string values", () => {
    cy.url().should("not.include", "?");
  });

  it("should display list of search results", () => {
    cy.get(searchResultsSelector).should("be.visible");
  });
});
