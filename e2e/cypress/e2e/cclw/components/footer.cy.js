/// <reference types="cypress" />
import { clickCookiePolicy } from "../../../utils/cookiePolicy";

const footerSelectors = ["[data-cy='report-problem']", "[data-cy='footer-gri']", "[data-cy='footer-cpr']"];

describe("Footer", () => {
  before(() => {
    cy.visit("/");
    clickCookiePolicy();
  });

  it("footer should be visible", () => {
    cy.get("footer").should("be.visible");
  });

  it("should display correct footer elements", () => {
    footerSelectors.forEach((selector) => {
      cy.get(selector).should("be.visible");
    });
  });
});
