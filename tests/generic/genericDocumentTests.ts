import { expect, test } from "@playwright/test";

import { TTheme } from "@/types";

import { TEST_DOCUMENTS } from "./testDocuments";
import { documentPageModel as documentPage } from "../pageObjectModels/documentPageModel";
import { genericPageModel as genericPage } from "../pageObjectModels/genericPageModel";

export const runGenericDocumentTests = (theme: TTheme): void => {
  const documentsToTest = TEST_DOCUMENTS.filter((testDocument) => testDocument.availableOn.includes(theme));

  documentsToTest.forEach(({ titleForTests, slug, withSearch, withTopic }) => {
    test(`changing the search query updates the passage matches - ${titleForTests}`, async ({ page }) => {
      // Load the document page

      await documentPage.goToDocument(page, `${slug}?q=${withSearch}&cfn=${withTopic}`);
      // waiting for state "load" rather than "networkidle" as the latter was waiting for the PDF viewer
      // which was causing timing issues in the test as it is currently not loading locally
      // replace with genericPage.waitUntilLoaded(page) if no longer an issue
      await page.waitForLoadState("load");
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

      await genericPage.dismissPopups(page);

      // Enter a different search query

      const searchInput = page.getByRole("textbox", { name: "Search" });
      await searchInput.fill("benchmark");
      await searchInput.press("Enter");

      // Check that Passage matches section is updated with the new search query
      // The regex will match both "1 match for 'benchmark'" and "10 matches for 'benchmark'"
      await expect(page.getByRole("region", { name: "Passage matches" })).toHaveText(/\d+ matche?s? for 'benchmark'/);
    });
  });
};
