import { expect, test } from "@playwright/test";

import { genericPageModel as genericPage } from "../pageObjectModels/genericPageModel";
import { geographyPageModel as geographyPage } from "../pageObjectModels/geographyPageModel";

export const runGenericGeographyTests = () => {
  test.describe("Generic geography tests", () => {
    test("navigate to a family from the geography page", async ({ page }) => {
      await geographyPage.goToGeography(page, "france");
      await genericPage.waitUntilLoaded(page);
      await genericPage.dismissPopups(page);

      const recentDocumentsSection = await geographyPage.focusOnSection(page, /^Recent documents/);

      const familyLink = recentDocumentsSection.getByRole("link").first();
      await expect(familyLink).toBeVisible();

      const familyName = await familyLink.innerText();
      const familyHref = await familyLink.getAttribute("href");

      await familyLink.click();

      await page.waitForURL("**" + familyHref);
      await genericPage.waitUntilLoaded(page, familyName);
    });
  });
};
