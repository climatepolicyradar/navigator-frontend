import { expect, test } from "@playwright/test";

import { collectionPageModel as collectionPage } from "../pageObjectModels/collectionPageModel";
import { genericPageModel as genericPage } from "../pageObjectModels/genericPageModel";

const EXEMPLARY_COLLECTION_SLUG = "leon-v-exxon-mobil-corp_b93f";

test.describe("Collection page", () => {
  test("should open document page when clicking a document link in the collection", async ({ page }) => {
    await collectionPage.goToCollection(page, EXEMPLARY_COLLECTION_SLUG);
    await genericPage.waitUntilLoaded(page, "Leon v. Exxon Mobil Corp");

    const tableOfDocuments = page.getByRole("table").first();
    const documentLink = tableOfDocuments.getByRole("link").first();

    await expect(documentLink).toBeVisible();

    const documentName = await documentLink.innerText();
    const documentHref = await documentLink.getAttribute("href");

    await genericPage.dismissPopups(page);

    await documentLink.click();

    await page.waitForURL("**" + documentHref);
    await genericPage.waitUntilLoaded(page, documentName);
  });
});
