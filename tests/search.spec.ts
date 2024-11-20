import { test, expect } from "@playwright/test";

test("search", async ({ page }) => {
  /** Reject the consent banner */
  await page.goto("/");
  await page.getByRole("button", { name: "Reject" }).click();

  /** Homepage */
  await expect(page.getByLabel("Search").first()).toBeVisible();
  await page.getByLabel("Search").first().fill("Adaptation strategy");
  await page.getByRole("button", { name: "Search" }).click();

  /** Search */
  await page.waitForURL("/search*");
  const searchResultsHeading = page.getByRole("heading", { name: "Search results" });
  /**
   * This finds the first container that has the heading search results.
   * We could probably have a more semantic search markup with lists.
   */
  const searchResults = page.locator("div").filter({ has: searchResultsHeading }).last();
  await expect(searchResults).toBeVisible();
  await searchResults.getByRole("link").first().click();

  /** Document page */
  await page.waitForURL("/document/*");
  await page.getByText(/View \d+ matches/).click();

  /** Documents Page */
  await page.waitForURL("/documents/*");
  await expect(page.getByText("View source document")).toBeVisible();
});
