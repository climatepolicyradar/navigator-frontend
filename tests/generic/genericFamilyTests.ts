import { expect, test } from "@playwright/test";

import { TTheme } from "@/types";

import { documentPageModel as documentPage } from "../pageObjectModels/documentPageModel";
import { familyPageModel as familyPage } from "../pageObjectModels/familyPageModel";

type TTestFamily = {
  titleForTests: string;
  slug: string;
  withSearch: string; // The URL param value of a search that has passage matches on a document in the family
  withTopic: string; // The URL param value of a topic that exists on the family
  availableOn: TTheme[];
};

const TEST_FAMILIES: TTestFamily[] = [
  {
    titleForTests: "example",
    slug: "the-sixth-carbon-budget_179f",
    withSearch: "electric-vehicles",
    withTopic: "target",
    availableOn: ["cpr"],
  },
];

// Not all family tests are or should be generic - consider testing app-specific features explicitly
export const runGenericFamilyTests = (theme: TTheme): void => {
  const familiesToTest = TEST_FAMILIES.filter((testFamily) => testFamily.availableOn.includes(theme));

  familiesToTest.forEach(({ titleForTests, slug, withSearch, withTopic }) => {
    test(`navigate to document passages for a different topic in the family - ${titleForTests}`, async ({ page }) => {
      // Load the family page

      await familyPage.goToFamily(page, `${slug}?q=${withSearch}&cfn=${withTopic}`);
      await familyPage.waitUntilLoaded(page);

      // Click on a topic not already part of the active filters

      const topicsSection = await familyPage.focusOnSection(page, /^Topics mentioned most/);
      const differentTopic = await familyPage.getTopicButton(topicsSection, { hasNotText: "Target" });
      const differentTopicText = await differentTopic.innerText();

      differentTopic.click();

      // Click a document in the topics drawer to navigate to the document page

      const topicsDrawer = await familyPage.focusOnDrawer(page, differentTopicText);
      const tableOfDocuments = topicsDrawer.getByRole("table");
      const documentLink = tableOfDocuments.getByRole("link").first();
      await expect(documentLink).toBeVisible();

      const documentName = await documentLink.innerText();
      const documentHref = await documentLink.getAttribute("href");

      await documentLink.click();

      // Verify the document page loads with the correct filters

      await page.waitForURL("**" + documentHref);
      await documentPage.waitUntilLoaded(page, documentName);
    });
  });
};
