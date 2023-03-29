/// <reference types="cypress" />
import { clickCookiePolicy } from "../../../utils/cookiePolicy";
const inputSelector = '[data-cy="search-input"]';
const searchResultsSelector = '[data-cy="search-results"]';

const filterSelectors = [
  '[data-cy="exact-match"]',
  '[data-cy="regions"]',
  '[data-cy="countries"]',
  '[data-cy="date-range"]',
  '[data-cy="methodology-notice"]',
];

const selectedCountries = '[data-cy="selected-countries"]';
const tabbedNavSelector = '[data-cy="tabbed-nav"]';
const sortSelector = '[data-cy="sort"]';

const pageSelectors = [inputSelector, searchResultsSelector, '[data-cy="download-search-csv"]', '[data-cy="number-of-results"]', tabbedNavSelector, sortSelector];

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

  it("should display the container for list of search results", () => {
    cy.get(searchResultsSelector).should("be.visible");
  });

  it("should display the correct page elements", () => {
    pageSelectors.forEach((selector) => {
      cy.get(selector, { timeout: 10000 }).should("be.visible");
    });
  });

  it("search input should be empty", () => {
    cy.get(inputSelector).should("have.value", "");
  });

  it("should display the correct number of category tabs", () => {
    cy.get(tabbedNavSelector).children().should("have.length", 4);
  });

  it("should display one tab selected, and be 'All' by default", () => {
    cy.get(tabbedNavSelector).children(".tabbed-nav__active").should("have.length", 1).contains("All");
  });

  it("should contain the correct number of sort options", () => {
    cy.get(sortSelector).children("select").children().should("have.length", 4);
  });
});
