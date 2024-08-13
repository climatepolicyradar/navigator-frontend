/// <reference types="cypress" />

describe("Landing page", () => {
  before(() => {
    cy.visit("/");
  });

  it("should display the placeholder homepage", () => {
    cy.contains("Hello World").should("be.visible");
  });
});
