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
  await page.getByRole("button", { name: "Search" }).click();

  /** Search */
  await page.waitForURL("/search*");
  /**
   * This finds the first container that has the heading search results.
   * We could probably have a more semantic search markup with lists.
   */
  const searchResultsHeading = page.getByRole("heading", { name: "Search results" });
  const searchResults = page.locator("div").filter({ has: searchResultsHeading }).last();
  await expect(searchResults).toBeVisible();
  await searchResults.getByRole("link").first().click();

  /** Document page */
  await page.waitForURL("/document/*");
  await page
    .getByText(/View \d+ matches/)
    .first()
    .click();

  /** Documents Page */
  await page.waitForURL("/documents/*");
  await expect(page.getByText("View source document")).toBeVisible();
});
