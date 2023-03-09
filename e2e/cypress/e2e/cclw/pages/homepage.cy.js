/// <reference types="cypress" />
import { clickCookiePolicy } from "../../../utils/cookiePolicy";

describe("Homepage", () => {
  before(() => {
    cy.visit("/");
    clickCookiePolicy();
  });

  // Phase 1 - are we in the right place
  it("should be on the homepage", () => {
    cy.location("pathname").should("eq", "/");
  });

  // Phase 2 - are the right things visible

  // Phase 3 - can we interact with the page
});
