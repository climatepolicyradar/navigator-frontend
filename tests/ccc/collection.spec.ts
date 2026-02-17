import { expect, test } from "@playwright/test";

import { collectionPageModel as collectionPage } from "../pageObjectModels/collectionPageModel";
import { documentPageModel as documentPage } from "../pageObjectModels/documentPageModel";

const EXEMPLARY_COLLECTION_SLUG = "leon-v-exxon-mobil-corp_b93f";

function parseDateString(dateString: string): number {
  const [month, day, year] = dateString.split("/").map(Number);
  return new Date(year, month - 1, day).getTime();
}

function isSortedDescending(dates: number[]): boolean {
  for (let i = 1; i < dates.length; i++) {
    if (dates[i] > dates[i - 1]) return false;
  }
  return true;
}

test.describe("Collection page", () => {
  test("should open document page when clicking a document link in the collection", async ({ page }) => {
    await collectionPage.goToCollection(page, EXEMPLARY_COLLECTION_SLUG);
    await collectionPage.waitUntilLoaded(page, "Leon v. Exxon Mobil Corp");

    const tableOfDocuments = page.getByRole("table").first();
    const documentLink = tableOfDocuments.getByRole("link").first();

    await expect(documentLink).toBeVisible();

    const documentName = await documentLink.innerText();
    const documentHref = await documentLink.getAttribute("href");

    await collectionPage.dismissOverlays(page);

    await documentLink.click();

    await page.waitForURL("**" + documentHref);
    await documentPage.waitUntilLoaded(page, documentName);
  });

  test("should display events sorted by filing date descending by default", async ({ page }) => {
    await collectionPage.goToCollection(page, EXEMPLARY_COLLECTION_SLUG);
    await collectionPage.waitUntilLoaded(page, "Leon v. Exxon Mobil Corp");
    await collectionPage.dismissOverlays(page);

    const table = page.getByRole("table").first();
    await expect(table).toBeVisible();

    const dateStrings = await table
      .locator("div")
      .filter({ hasText: /^\d{2}\/\d{2}\/\d{4}$/ })
      .allInnerTexts();

    const dates = dateStrings.map(parseDateString);

    expect(dates.length).toBeGreaterThan(0);
    expect(isSortedDescending(dates)).toBeTruthy();
  });
});
