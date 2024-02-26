/// <reference types="cypress" />
// import CCLW_redirects from "../../../../src/redirects/CCLW_redirects.json";

const startingIndex = 0;
const createTestCases = false;

// TODO: write a better test script for redirects that doesn't run through the entire set of redirects
// For example: we could use a sample of redirects to test against

describe.skip("Redirects", () => {
  const CCLW_redirects = [];
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
