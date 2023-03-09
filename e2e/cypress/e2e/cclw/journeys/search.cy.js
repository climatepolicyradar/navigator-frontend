/// <reference types="cypress" />
import { clickCookiePolicy } from "../../../utils/cookiePolicy";

const searchInputSelector = '[data-cy="search-input"]';
const searchResultsSelector = '[data-cy="search-results"]';
const searchTerm = "adaptation report";
const searchTermQueryString = "?q=adaptation+report";

describe("Search Flow", () => {
  before(() => {
    cy.visit("/");
    clickCookiePolicy();
  });

  it("should display the input, type in search", () => {
    cy.get(searchInputSelector)
      .should("be.visible")
      .type(searchTerm)
      .should('have.value', searchTerm);
  });

  it("should submit the search form when enter is pressed", () => {
    cy.get(searchInputSelector).type("{enter}");
  });

  it("should now be on the search page", () => {
    cy.url().should("include", "/search");
  });

  it("should have the accurate query string value", () => {
    cy.location().should((loc) => {
      expect(loc.search).to.eq(searchTermQueryString)
      expect(loc.pathname).to.eq('/search')
    })
  });

  it("should display list of search results", () => {
    cy.get(searchResultsSelector).should("be.visible");
  });
});
