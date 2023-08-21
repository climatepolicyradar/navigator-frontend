/// <reference types="cypress" />
import { clickCookiePolicy } from "../../../utils/cookiePolicy";

const searchResultsSelector = '[data-cy="search-results"]';
const countryLinkSelector = '[data-cy="country-link"]';

describe("Browse Flow", () => {
  before(() => {
    cy.visit("/");
    clickCookiePolicy();
  });

  it("should display the input form and clickable button, which is clicked", () => {
    cy.get('[data-cy="search-input"] + button').should("be.visible").click();
  });

  it("should now be on the search page", () => {
    cy.url().should("include", "/search");
  });

  it("should not have any query string values", () => {
    cy.url().should("not.include", "?");
  });

  it("should display list of search results", () => {
    cy.get(searchResultsSelector, { timeout: 10000 }).should("be.visible");
  });

  it("should display a list of 10 search results", () => {
    cy.get(searchResultsSelector).children({ timeout: 10000 }).should("have.length", 10);
  });

  it("should have a clickable country link, which is clickable", () => {
    cy.get(searchResultsSelector).children().eq(0).find(countryLinkSelector).should("be.visible").click();
  });

  it("should now be on the geography page", () => {
    cy.url().should("include", "/geographies");
  });

});
