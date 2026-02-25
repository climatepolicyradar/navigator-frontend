import { test, expect } from "@playwright/test";

import { genericPageModel as genericPage } from "../pageObjectModels/genericPageModel";

test("search", async ({ page }) => {
  await page.goto("/");
  await genericPage.waitUntilLoaded(page);
  /** Reject the consent banner */
  await genericPage.dismissPopups(page);

  /** Homepage */
  await expect(page.getByLabel("Search").first()).toBeVisible();
  await page.getByLabel("Search").first().fill("Adaptation strategy");

  /** Test keyboard submission */
  await page.getByLabel("Search").first().press("Enter");
  await page.waitForURL("/search*");

  /** Test tap submission  */
  await page.goBack();
  await expect(page.getByLabel("Search").first()).toBeVisible();
  await page.getByLabel("Search").first().fill("Climate");
  await page.getByRole("button", { name: "Search" }).click();

  /** Search */
  await Promise.all([page.waitForURL("/search*"), page.waitForResponse("**/searches")]);

  /**
   * This finds the first container that has the heading search results.
   * We could probably have a more semantic search markup with lists.
   */
  const searchResultsHeading = page.getByRole("heading", {
    name: "Search results",
  });
  const searchResults = page.locator("div").filter({ has: searchResultsHeading }).last();
  await expect(searchResults).toBeVisible();

  /** Check the structure of the search result */
  const firstSearchResult = searchResults.locator('[data-cy="search-result"]').first();
  await expect(firstSearchResult).toBeVisible();

  /** TODO: Make the markup more semantic */
  await expect(firstSearchResult.locator('[data-cy="family-title"]').first()).toBeVisible();
  await expect(firstSearchResult.locator('[data-cy="family-metadata-category"]').first()).toBeVisible();
  await expect(firstSearchResult.locator('[data-cy="family-metadata-year"]').first()).toBeVisible();

  // Check if country link exists at all
  const countryLink = firstSearchResult.locator('[data-cy="country-link"]').first();
  await expect(countryLink).toBeVisible();

  // Click first search result family title link
  await firstSearchResult.locator('[data-cy="family-title"]').first().click();

  /** Family page */
  await Promise.all([page.waitForURL("/document/*"), page.waitForResponse("**/searches")]);
  await page
    .getByText(/(more than )?\d+ matches/)
    .first()
    .click();

  /** Document Page */
  await Promise.all([page.waitForURL("/documents/*"), page.waitForResponse("**/searches")]);
  await expect(page.getByText("View source document")).toBeVisible();
});
