/// <reference types="cypress" />
import { clickCookiePolicy } from "../../../utils/cookiePolicy";

const pageSelectors = [
  "[data-cy='header']",
  "[data-cy='featured-content']",
  "[data-cy='powered-by']",
  "[data-cy='partners']",
  "[data-cy='search-input']",
  "[data-cy='intro-message']",
  "[data-cy='homepage-feature-1']",
  "[data-cy='homepage-feature-2']",
  "[data-cy='homepage-help-us']",
  "[data-cy='feature-highlights']",
  "[data-cy='world-map']",
  "footer",
];

const logoSelectors = ["[data-cy='lse-logo']", "[data-cy='gri-logo']", "[data-cy='cclw-logo']", "[data-cy='cpr-logo']"];

const navigationSelectors = [
  "[data-cy='navigation-home']",
  "[data-cy='navigation-about']",
  "[data-cy='navigation-methodology']",
  "[data-cy='navigation-faq']",
  "[data-cy='navigation-search']",
  "[data-cy='navigation-framework-laws']",
  "[data-cy='navigation-contact']",
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

  it("should display correct logos", () => {
    logoSelectors.forEach((selector) => {
      cy.get(selector).should("be.visible");
    });
  });

  it("should display correct menu and navigation elements", () => {
    cy.get("[data-cy='menu-icon']").click();
    cy.get("[data-cy='dropdown-menu']").children().should("have.length", 8);

    navigationSelectors.forEach((selector) => {
      cy.get(selector).should("be.visible");
    });
  });
});
