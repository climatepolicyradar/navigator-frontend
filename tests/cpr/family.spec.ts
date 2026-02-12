import { expect, test } from "@playwright/test";

import { FamilyPageModel } from "../pageObjectModels/familyPageModel";

const EXEMPLARY_FAMILY_URL = "the-sixth-carbon-budget_179f?q=electric+vehicles";

test.describe("CPR family page", () => {
  test("should load a family page", async ({ page }) => {
    const FamilyPage = new FamilyPageModel(page);

    await FamilyPage.goToFamilyPage(EXEMPLARY_FAMILY_URL);
    await FamilyPage.waitForPageLoad();

    const topicsSection = page.getByRole("region").filter({ has: page.getByRole("heading", { name: /^Topics mentioned most/i }) });
    await expect(topicsSection).toBeVisible();

    const differentTopic = topicsSection.getByRole("button").filter({ hasNotText: "Target" }).first();
    await expect(differentTopic).toBeVisible();
    const differentTopicText = await differentTopic.innerText();

    differentTopic.click();
    const topicsDrawer = page.getByRole("dialog");
    await expect(topicsDrawer.filter({ has: page.getByRole("heading", { name: differentTopicText }) })).toBeVisible();

    const documentsTable = topicsDrawer.getByRole("table");
    const documentLink = documentsTable.getByRole("link").first();
    const documentName = await documentLink.innerText();
    const documentHref = await documentLink.getAttribute("href");
    console.log({ documentHref });
    await expect(documentLink).toBeVisible();

    await documentLink.click();

    await page.waitForURL("**" + documentHref);
    await expect(page.getByRole("heading", { name: documentName, level: 1 })).toBeVisible();
  });
});

/**
 * TODO
 * - Open a family page that we don't know ahead of time (do a search - beforeAll)
 * - verify that the family page has loaded
 * - click on a topic not already filtered
 * - click a document in the tray
 * - wait for doc page to have loaded(?)
 * - verify URL is as expected after waiting
 */

/**
 * - look for a block/section
 * - filter by title
 * - within that, get the topic button
 */
