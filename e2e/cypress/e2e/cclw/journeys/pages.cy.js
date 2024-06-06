/// <reference types="cypress" />

const pages = ["/", "/about", "/contact", "faq", "methodology", "framework-laws", "terms-of-use"];

describe("Check pages exist", () => {
  pages.forEach((page) => {
    it(`Check ${page}`, () => {
      cy.visit(page);
      cy.get("h1").should("exist");
    });
  });
});
