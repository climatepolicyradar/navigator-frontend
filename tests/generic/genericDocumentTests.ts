import { expect, test } from "@playwright/test";

import { TTheme } from "@/types";

import { TEST_DOCUMENTS } from "./testDocuments";
import { documentPageModel as documentPage } from "../pageObjectModels/documentPageModel";
import { genericPageModel as genericPage } from "../pageObjectModels/genericPageModel";

export const runGenericDocumentTests = (theme: TTheme): void => {
  const documentsToTest = TEST_DOCUMENTS.filter((testDocument) => testDocument.availableOn.includes(theme));

  documentsToTest.forEach(({ titleForTests, slug, withSearch, withTopic }) => {
    test(`adding a search query generates passage matches - ${titleForTests}`, async ({ page }) => {
      // Load the document page

      await documentPage.goToDocument(page, slug);
      await genericPage.waitUntilLoaded(page);
      await genericPage.dismissPopups(page);

      // Ensure the passage matches list is empty to start

      // Enter a search query

      const searchInput = page.getByRole("textbox", { name: "Search" });
      await searchInput.fill(withSearch);
      await searchInput.press("Enter");

      // Check that passage matches appear
    });

    test(`selecting a topic generates passage matches - ${titleForTests}`, async ({ page }) => {
      // Load the document page

      await documentPage.goToDocument(page, slug);
      await genericPage.waitUntilLoaded(page);
      await genericPage.dismissPopups(page);

      // Ensure the passage matches list is empty to start

      // Expand Accordion???
      // Select a topic
      const topic = page.getByRole("checkbox", { name: withTopic });
      await topic.click();
      await expect(topic).toBeChecked();

      // Check that passage matches appear
    });
  });
};
