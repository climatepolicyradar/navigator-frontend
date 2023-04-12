/// <reference types="cypress" />
import CCLW_redirects from "../../../../src/redirects/CCLW_redirects.json";

const startingIndex = 0;
const createTestCases = false;

describe.skip("Redirects", () => {
  if (createTestCases) {
    for (let index = startingIndex; index < CCLW_redirects.length; index++) {
      it(`should import all data items successfully - row:${index} - source:${CCLW_redirects[index].destination}`, () => {
        if (!CCLW_redirects) {
          throw new Error("Redirects not provided");
        }
        cy.log(CCLW_redirects.length);
        const redirect = CCLW_redirects[index];
        if (!redirect) {
          throw new Error("Element does not exist");
        }
        cy.visit(redirect.source);
        cy.get("h1", { timeout: 1000 }).should("not.have.text", "Sorry, we can't find that page");
      });
    }
  }
});
