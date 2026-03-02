import { test, expect } from "@playwright/test";

import { genericPageModel as genericPage } from "../pageObjectModels/genericPageModel";

test.describe("Search", () => {
  test("basic search from homepage", async ({ page }) => {
    await page.goto("/");
    /** Wait for page to finish loading */
    await page.waitForLoadState("networkidle");

    /** Reject the consent banner */
    await genericPage.dismissPopups(page);

    /** Homepage */
    await page.getByRole("searchbox", { name: "Search term" }).fill("Adaptation strategy");
    await page.getByRole("button", { name: "Search" }).click();

    /** Search */
    await Promise.all([page.waitForURL("/search*"), page.waitForResponse("**/searches")]);

    const searchResultsSection = page.getByRole("region").filter({ has: page.getByRole("heading", { name: "Search results", level: 2 }) });
    await expect(searchResultsSection).toBeVisible();

    const searchResults = page.getByRole("list", { name: "Search results" });

    await expect(searchResults).toBeVisible();

    /** Click first search result family title link */
    const firstSearchResult = searchResults.getByRole("listitem").nth(0);
    const familyLink = firstSearchResult.getByRole("link", { name: "Search result title" });
    const familyName = await familyLink.innerText();
    const familyHref = await familyLink.getAttribute("href");

    await familyLink.click();

    /** Family page */
    await Promise.all([page.waitForURL("**" + familyHref), page.waitForResponse("**/searches")]);
    await genericPage.waitUntilLoaded(page, familyName);
  });

  test("navigate to geography page from search", async ({ page }) => {
    await page.goto("/search");
    /** Wait for page to finish loading */
    await page.waitForLoadState("networkidle");

    const searchResultsSection = page.getByRole("region").filter({ has: page.getByRole("heading", { name: "Search results", level: 2 }) });
    await expect(searchResultsSection).toBeVisible();

    const searchResults = page.getByRole("list", { name: "Search results" });

    await expect(searchResults).toBeVisible();

    /** Click first search result geography link */
    const firstSearchResult = searchResults.getByRole("listitem").nth(0);
    const countryLink = firstSearchResult.getByRole("region", { name: "Country links" }).getByRole("link").first();
    await expect(countryLink).toBeVisible();

    const countryName = await countryLink.innerText();
    const countryHref = await countryLink.getAttribute("href");

    await countryLink.click();

    /** Geography page */
    await page.waitForURL("**" + countryHref);
    await genericPage.waitUntilLoaded(page, countryName);
  });
});
