import { test, expect } from "@playwright/test";

test("search", async ({ page }) => {
  await page.goto("/");

  /** Reject the consent banner */
  const consentHeading = page.getByText("Cookies and your privacy");
  const consentBanner = page.locator("div").filter({ has: consentHeading });
  await consentBanner.getByRole("button", { name: "Reject" }).click();

  /** Homepage */
  await expect(page.getByLabel("Search").first()).toBeVisible();
  await page.getByLabel("Search").first().fill("Adaptation strategy");

  /** Test keyboard submission */
  await page.getByLabel("Search").first().press("Enter");
  await page.waitForURL("/search*");

  /** Test tap submission  */
  await page.goBack();
  await expect(page.getByLabel("Search").first()).toBeVisible();
  await page.getByLabel("Search").first().fill("Adaptation strategy");
  await page.getByRole("button", { name: "Search" }).click();

  /** Search */
  await page.waitForURL("/search*");
  await page.waitForResponse("**/searches");
  /**
   * This finds the first container that has the heading search results.
   * We could probably have a more semantic search markup with lists.
   */
  const searchResultsHeading = page.getByRole("heading", { name: "Search results" });
  const searchResults = page.locator("div").filter({ has: searchResultsHeading }).last();
  await expect(searchResults).toBeVisible();

  /** Check the structure of the search result */
  const firstSearchResult = searchResults.locator('[data-cy="search-result"]').first();
  await expect(firstSearchResult).toBeVisible();

  /** TODO: Make the markup more semantic */
  await expect(firstSearchResult.locator('[data-cy="family-title"]')).toBeVisible();
  await expect(firstSearchResult.locator('[data-cy="family-metadata-category"]')).toBeVisible();
  await expect(firstSearchResult.locator('[data-cy="family-metadata-year"]')).toBeVisible();
  await expect(firstSearchResult.locator('[data-cy="family-description"]')).toBeVisible();
  await expect(firstSearchResult.locator('[data-cy="country-link"]')).toBeVisible();

  await searchResults.getByRole("link").first().click();

  /** Document (AKA Family) page */
  await page.waitForURL("/document/*");
  await page.waitForResponse("**/searches");
  await page
    .getByText(/View (more than )?\d+ matches/)
    .first()
    .click();

  /** Documents Page */
  await page.waitForURL("/documents/*");
  await page.waitForResponse("**/searches");
  await expect(page.getByText("View source document")).toBeVisible();
});
