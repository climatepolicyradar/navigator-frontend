/// <reference types="cypress" />
import { clickCookiePolicy } from "../../../utils/cookiePolicy";

const searchInputSelector = '[data-cy="search-input"]';
const searchResultsSelector = '[data-cy="search-results"]';
const searchTerm = "adaptation report";
const searchTermQueryString = "adaptation+report";

describe("Search Flow", () => {
  before(() => {
    cy.visit("/");
    clickCookiePolicy();
  });

  it("should display the input, type in search", () => {
    cy.get(searchInputSelector)
      .should("be.visible")
      .type(searchTerm)
      .invoke("val")
      .then((val) => {
        const myVal = val;
        expect(myVal).to.equal(searchTerm);
      });
  });

  it("should submit the search form when enter is pressed", () => {
    cy.get(searchInputSelector).type("{enter}");
  });

  it("should now be on the search page", () => {
    cy.url().should("include", "/search");
  });

  it("should have the accurate query string value", () => {
    cy.url().should("include", `q=${searchTermQueryString}`);
  });

  it("should display list of search results", () => {
    cy.get(searchResultsSelector).should("be.visible");
  });
});
