/// <reference types="cypress" />

describe("Landing page", () => {
  before(() => {
    cy.visit("/");
  });

  it("should display the placeholder homepage", () => {
    cy.contains("MCF Custom App").should("be.visible");
  });
});
