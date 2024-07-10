/// <reference types="cypress" />
import { clickCookiePolicy } from "../../../utils/cookiePolicy";

const searchResultsSelector = '[data-cy="search-results"]';
const countryLinkSelector = '[data-cy="country-link"]';
const familyTitleSelector = '[data-cy="family-title"]';

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

  it("should display a list of 20 search results", () => {
    cy.get(searchResultsSelector).children({ timeout: 10000 }).should("have.length", 20);
  });

  it("should have a clickable header, which navigates to the document family view", () => {
    cy.get(searchResultsSelector).children().eq(0).find(familyTitleSelector).children("a").should("be.visible").click();
  });

  it("should now be on the document family page", () => {
    cy.url().should("include", "/document");
  });
});
