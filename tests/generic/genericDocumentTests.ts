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
      await genericPage.waitUntilLoaded(page);
      await genericPage.dismissPopups(page);

      // Enter a different search query

      await page.getByRole("textbox", { name: "Search" }).fill("emissions");

      // Check that Passage matches section is updated with the new search query

      await expect(page.getByRole("region", { name: "Passage matches" })).toHaveText(/matches for 'emissions'/);
    });
  });
};
