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

    /** Search — this theme serves the v2 results page at /search, see themes/cpr/rewrites.json */
    await Promise.all([page.waitForURL("/search*"), page.waitForResponse("**/search/documents*")]);

    const searchResults = page.locator('[data-cy="search-results"]');
    await expect(searchResults).toBeVisible();

    /** A result opens a drawer over the results rather than navigating away */
    const firstSearchResult = searchResults.getByRole("listitem").nth(0);
    await firstSearchResult.getByRole("button").click();

    const drawer = page.getByRole("dialog");
    await expect(drawer).toBeVisible();
    await page.waitForURL(/[?&]principal=/);

    /** Family page, reached from the drawer's title */
    const familyLink = drawer.getByRole("link").first();
    const familyName = await familyLink.innerText();
    const familyHref = await familyLink.getAttribute("href");
    await familyLink.click();

    await page.waitForURL("**" + familyHref);
    await genericPage.waitUntilLoaded(page, familyName);
  });
});
