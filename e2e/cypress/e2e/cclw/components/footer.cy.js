/// <reference types="cypress" />
import { clickCookiePolicy } from "../../../utils/cookiePolicy";

const griSelector = "[data-cy='footer-gri']";
const cprSelector = "[data-cy='footer-cpr-links']";
const footerSelectors = ["[data-cy='feedback']", griSelector, cprSelector];
const footerContains = [
  "Follow Grantham Research Institute",
  "Follow Climate Policy Radar",
  `Copyright © LSE ${new Date().getFullYear()}`,
  "Privacy policy",
  "Terms of use",
];

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

  it("should display correct footer text", () => {
    footerContains.forEach((text) => {
      cy.get("footer").contains(text).should("be.visible");
    });
  });

  it("should contain two sets of footer social links", () => {
    cy.get("footer").within(() => {
      cy.get(".footer__social-links").should("have.length", 2).children("a").children("img");
    });
  });

  it("should contain GRI footer links", () => {
    cy.get("footer").within(() => {
      cy.get(griSelector).find("ul").children("li").should("have.length", 8);
    });
  });

  it("should contain CPR footer links", () => {
    cy.get("footer").within(() => {
      cy.get(cprSelector).children("li").should("have.length", 3);
    });
  });
});
