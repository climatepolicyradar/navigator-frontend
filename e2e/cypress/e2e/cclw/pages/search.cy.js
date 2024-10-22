/// <reference types="cypress" />
import { clickCookiePolicy } from "../../../utils/cookiePolicy";
const inputSelector = '[data-cy="search-input"]';
const searchResultsSelector = '[data-cy="search-results"]';

const categoryFilterSelector = '[data-cy="categories"]';
const filterSelectors = [
  categoryFilterSelector,
  '[data-cy="regions"]',
  '[data-cy="countries"]',
  '[data-cy="date-range"]',
  '[data-cy="methodology-notice"]',
];

const appliedFiltersSelector = '[data-cy="applied-filters"]';

const searchOptionsSelector = '[data-cy="search-options"]';
const searchSettingsSelector = '[data-cy="search-settings"]';

const searchSettingsSelectors = ['[data-cy="semantic-search"]', '[data-cy="sort"]'];

const pageSelectors = [
  inputSelector,
  searchResultsSelector,
  '[data-cy="download-search-csv"]',
  '[data-cy="download-entire-search-csv"]',
  '[data-cy="number-of-results"]',
];

const breadcrumbSelectors = ["[data-cy='breadcrumbs']", "[data-cy='breadcrumb home']", "[data-cy='breadcrumb current']"];

const accordianControlSelector = '[data-cy="accordian-control"]';

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

  it("should display the search options", () => {
    cy.get(searchOptionsSelector).should("be.visible");
  });

  it("should display the search settings when options is clicked", () => {
    cy.get(searchOptionsSelector).click();
    cy.get(searchSettingsSelector).should("be.visible");
  });

  it("should display the correct search settings", () => {
    searchSettingsSelectors.forEach((selector) => {
      cy.get(selector).should("be.visible");
    });
  });

  it("should hide the search settings when clicking outside", () => {
    cy.get("body").click();
    cy.get(searchSettingsSelector).should("not.exist");
  });

  it("should display the container for list of search results", () => {
    cy.get(searchResultsSelector, { timeout: 10000 }).should("be.visible");
  });

  it("should display the correct page elements", () => {
    pageSelectors.forEach((selector) => {
      cy.get(selector, { timeout: 10000 }).should("be.visible");
    });
  });

  it("should display the breadcrumbs", () => {
    breadcrumbSelectors.forEach((selector) => {
      cy.get(selector).should("be.visible");
    });
  });

  it("search input should be empty", () => {
    cy.get(inputSelector).should("have.value", "");
  });

  it("should allow typing into the search field", () => {
    cy.get(inputSelector).eq(1).type("cypress automated test");
    cy.get(inputSelector).eq(1).should("have.value", "cypress automated test");
    cy.get(inputSelector).eq(1).type("{enter}");
  });

  it("the first category filter should be 'All'", () => {
    cy.get(`${categoryFilterSelector} label`).eq(0).should("contain", "All");
  });

  it("should display the applied filters", () => {
    cy.get(appliedFiltersSelector).should("be.visible");
  });
});
