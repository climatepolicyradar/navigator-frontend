/// <reference types="cypress" />
import { clickCookiePolicy } from "../../../utils/cookiePolicy";

const pageSelectors = [
  "[data-cy='featured-content']",
  "[data-cy='partners']",
  "[data-cy='search-input']",
  "[data-cy='intro-message']",
  "[data-cy='feature-search']",
  "[data-cy='feature-litigation']",
  "[data-cy='feature-highlights']",
];

const headerSelectors = ["[data-cy='lse-logo']", "[data-cy='gri-logo']", "[data-cy='cclw-logo']", "[data-cy='cpr-logo']"];

const navigationSelectors = [
  "[data-cy='navigation']",
  "[data-cy='navigation-home']",
  "[data-cy='navigation-about']",
  "[data-cy='navigation-methodology']",
  "[data-cy='navigation-acknowledgements']",
  "[data-cy='navigation-search']",
];

describe("Homepage", () => {
  before(() => {
    cy.visit("/");
    clickCookiePolicy();
  });

  it("should be on the homepage", () => {
    cy.location("pathname").should("eq", "/");
  });

  it("should display correct page elements", () => {
    pageSelectors.forEach((selector) => {
      cy.get(selector).should("be.visible");
    });
  });

  it("should display correct header elements", () => {
    headerSelectors.forEach((selector) => {
      cy.get(selector).should("be.visible");
    });
  });

  it("should display correct navigation elements", () => {
    navigationSelectors.forEach((selector) => {
      cy.get(selector).should("be.visible");
    });
  });
});
