/// <reference types="cypress" />
import { clickCookiePolicy } from "../../../utils/cookiePolicy";
const searchResultsSelector = '[data-cy="search-results"]';

const filterSelectors = [
  '[data-cy="exact-match"]',
  '[data-cy="regions"]',
  '[data-cy="countries"]',
  '[data-cy="date-range"]',
  '[data-cy="methodology-notice"]',
];

const selectedCountries = '[data-cy="selected-countries"]';

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

  it("should display the filters", () => {
    filterSelectors.forEach((selector) => {
      cy.get(selector).should("be.visible");
    });
  });

  it("should not display the selected countries", () => {
    cy.get(selectedCountries).should("not.be.visible");
  });

  it("should display list of search results", () => {
    cy.get(searchResultsSelector).should("be.visible");
  });
  
});
