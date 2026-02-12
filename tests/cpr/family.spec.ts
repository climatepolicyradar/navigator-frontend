import { expect, test } from "@playwright/test";

import { documentPageModel as documentPage } from "../pageObjectModels/documentPageModel";
import { familyPageModel as familyPage } from "../pageObjectModels/familyPageModel";

const EXEMPLARY_FAMILY_URL = "the-sixth-carbon-budget_179f?q=electric+vehicles&cfn=target";

test.describe("CPR family page", () => {
  test("navigate to document passages for a different topic in the family", async ({ page }) => {
    // Load the family page

    await familyPage.goToFamily(page, EXEMPLARY_FAMILY_URL);
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

/**
 * TODO
 * - Open a family page that we don't know ahead of time (do a search - beforeAll)
 */
