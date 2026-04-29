import { expect, test } from "@playwright/test";

import { TTheme } from "@/types";

import { TEST_DOCUMENTS } from "./testDocuments";
import { documentPageModel as documentPage } from "../pageObjectModels/documentPageModel";
import { genericPageModel as genericPage } from "../pageObjectModels/genericPageModel";

export const runGenericDocumentTests = (theme: TTheme): void => {
  const documentsToTest = TEST_DOCUMENTS.filter((testDocument) => testDocument.availableOn.includes(theme));

  documentsToTest.forEach(({ titleForTests, slug, withSearch, withTopic, withParentTopic }) => {
    test(`adding a search query generates passage matches - ${titleForTests}`, async ({ page }) => {
      // Load the document page

      await documentPage.goToDocument(page, slug);
      await documentPage.waitUntilLoaded(page);
      await genericPage.dismissPopups(page);

      // Ensure the passage matches list is empty to start
      await expect(page.getByRole("list", { name: "Passage matches" })).not.toBeVisible();

      // Enter a search query

      const searchInput = page.getByRole("textbox", { name: "Search" });
      await searchInput.fill(withSearch);
      await documentPage.withBackendResponse(page, async () => {
        await searchInput.press("Enter");
      });

      // Check that passage matches appear
      const passageMatches = page.getByRole("list", { name: "Passage matches" });
      await expect(passageMatches).toBeVisible();
      expect((await passageMatches.all()).length).toBeGreaterThan(0);
    });

    test(`selecting a topic generates passage matches - ${titleForTests}`, async ({ page }) => {
      // Load the document page

      await documentPage.goToDocument(page, slug);
      await documentPage.waitUntilLoaded(page);
      await genericPage.dismissPopups(page);

      // Ensure the passage matches list is empty to start
      await expect(page.getByRole("list", { name: "Passage matches" })).not.toBeVisible();

      // Select a topic (some accordions can be open by default and some need to be manually expanded)
      await documentPage.ensureAccordionOpen(page, withParentTopic);
      const topic = page.getByRole("checkbox", { name: withTopic });

      await documentPage.withBackendResponse(page, async () => {
        await topic.click();
      });
      await expect(topic).toBeChecked();

      // Check that passage matches appear
      const passageMatches = page.getByRole("list", { name: "Passage matches" });
      await expect(passageMatches).toBeVisible();
      expect((await passageMatches.all()).length).toBeGreaterThan(0);
    });
  });
};
