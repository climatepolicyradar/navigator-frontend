import { expect, test, type Locator, type Page } from "@playwright/test";

import { genericPageModel as genericPage } from "../pageObjectModels/genericPageModel";

const EXPECTED_LATEST_ITEMS = 3;

/*
 * The "Latest" block renders dates as "DD Month YYYY" (see formatDate), which Date.parse
 * handles directly, so we can compare items without reimplementing the month lookup.
 */
const parseItemDate = (text: string): number => {
  const timestamp = Date.parse(text.trim());
  expect(timestamp, `Expected "${text}" to be a parsable date`).not.toBeNaN();
  return timestamp;
};

const focusOnLatestBlock = async (page: Page): Promise<Locator> => {
  const latestBlock = page.getByRole("complementary").filter({ has: page.getByRole("heading", { name: "Latest" }) });
  await expect(latestBlock).toBeVisible();
  return latestBlock;
};

test.describe("CCC latest cases feed", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await genericPage.waitUntilLoaded(page, "The Climate Litigation Database");
    await genericPage.dismissPopups(page);
  });

  test("shows the most recent database additions, each linking to its document", async ({ page }) => {
    const latestBlock = await focusOnLatestBlock(page);
    const items = latestBlock.getByRole("listitem");

    await expect(items).toHaveCount(EXPECTED_LATEST_ITEMS);

    for (const item of await items.all()) {
      const link = item.getByRole("link");
      await expect(link).toBeVisible();
      await expect(link).not.toBeEmpty();

      // Latest items are principal docs, so they link to a document page.
      expect(await link.getAttribute("href")).toContain("/document/");

      await expect(item.getByRole("paragraph")).not.toBeEmpty();
    }
  });

  test("orders latest cases by date added, most recent first", async ({ page }) => {
    const latestBlock = await focusOnLatestBlock(page);
    const dateTexts = await latestBlock.getByRole("listitem").getByRole("paragraph").allInnerTexts();

    expect(dateTexts).toHaveLength(EXPECTED_LATEST_ITEMS);

    const timestamps = dateTexts.map(parseItemDate);

    // Non-strict comparison as several cases are routinely added to the database on the same
    // day, so equal adjacent dates are expected and must not fail the test.
    for (let index = 1; index < timestamps.length; index++) {
      expect(timestamps[index], `Expected "${dateTexts[index]}" to be no newer than "${dateTexts[index - 1]}"`).toBeLessThanOrEqual(
        timestamps[index - 1]
      );
    }
  });

  test("view all cases leads to search results sorted by most recent", async ({ page }) => {
    const latestBlock = await focusOnLatestBlock(page);
    const viewAllLink = latestBlock.getByRole("link", { name: /View all cases/ });

    await expect(viewAllLink).toBeVisible();
    await viewAllLink.click();

    await page.waitForURL("**/search**");
    await genericPage.dismissPopups(page);

    /*
     * The sort is not set via a URL parameter -- browse mode (no query string) defaults to
     * date:desc in buildSearchQuery. Asserting on the rendered control is what catches a
     * regression in that default.
     */
    await expect(page.getByRole("button", { name: "Sort options" })).toContainText("Date: latest first");
  });
});
