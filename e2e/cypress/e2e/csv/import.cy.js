/// <reference types="cypress" />
const neatCSV = require("neat-csv");

const startingIndex = 0;
const endIndex = 0;

describe.skip("CSV Import", () => {
  let csvData = [];

  before(() => {
    cy.fixture("importData.csv")
      .then(neatCSV)
      .then((data) => {
        csvData = data;
      });
  });

  for (let index = startingIndex; index < endIndex; index++) {
    it(`should import all data items successfully - ${index}`, () => {
      if (!csvData) {
        throw new Error("CSV not provided");
      }
      cy.log(csvData.length);
      const element = csvData[index];
      // cy.log(element["CPR Family Slug"]);
      if (!element || !element["CPR Family Slug"]) {
        throw new Error("Element does not exist");
      }
      cy.visit(`/document/${element["CPR Family Slug"]}`);
      cy.contains("h1", element["Family name"], { timeout: 1000 }).should("be.visible");
    });
  }
});
