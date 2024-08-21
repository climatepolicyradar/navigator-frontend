/// <reference types="cypress" />
import { clickCookiePolicy } from "../../../utils/cookiePolicy";

const URL = "terms-of-use";

const pageHeadings = [
  "Introduction",
  "Using the CPR Database and App",
  "Commercial Licensing",
  "Disclaimer",
  "Our trade marks",
  "Links to other sites",
  "Changes To This Agreement",
  "Questions?",
];
const breadcrumbSelectors = ["[data-cy='breadcrumbs']", "[data-cy='breadcrumb home']", "[data-cy='breadcrumb current']"];

describe("Terms of Use Page", () => {
  before(() => {
    cy.visit(URL);
    cy.intercept(URL, (req) => {
      req.headers["app-token"] = process.env.NEXT_PUBLIC_APP_TOKEN;
    });
    clickCookiePolicy();
  });

  it("should load the terms of use page", () => {
    cy.location("pathname").should("include", "/terms-of-use");
  });

  it("should not have any query string values", () => {
    cy.url().should("not.include", "?");
  });

  it("should have the correct page title", () => {
    cy.title().should("include", "Terms of use");
  });

  it("should display the breadcrumbs", () => {
    breadcrumbSelectors.forEach((selector) => {
      cy.get(selector).should("be.visible");
    });
  });

  it("should display the page headings", () => {
    pageHeadings.forEach((heading) => {
      cy.contains("h2", heading).should("be.visible");
    });
  });
});
