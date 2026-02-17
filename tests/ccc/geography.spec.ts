import { test } from "@playwright/test";

import { genericPageModel as genericPage } from "../pageObjectModels/genericPageModel";
import { geographyPageModel as geographyPage } from "../pageObjectModels/geographyPageModel";

test.describe("CCC geography page", () => {
  test.describe("Generic geography tests", () => {
    test("navigate to a family from the geography page", async ({ page }) => {
      await geographyPage.goToGeography(page, "france");
      await genericPage.waitUntilLoaded(page);
      await genericPage.dismissPopups(page);

      const recentDocumentsSection = await geographyPage.focusOnSection(page, /^Recent cases/);

      const familyLink = recentDocumentsSection.getByRole("link").first();
      await expect(familyLink).toBeVisible();

      const familyName = await familyLink.innerText();
      const familyHref = await familyLink.getAttribute("href");

      await familyLink.click();

      await page.waitForURL("**" + familyHref);
      await genericPage.waitUntilLoaded(page, familyName);
    });
  });
  test("should navigate to sub division geography page", async ({ page }) => {
    await geographyPage.goToGeography(page, "united-states-of-america");

    await genericPage.waitUntilLoaded(page);
    await genericPage.dismissPopups(page);

    const subDivisionSection = await geographyPage.focusOnSection(page, /^Geographic sub-divisions/);
    const subDivisionLink = subDivisionSection.getByRole("link").first();
    await expect(subDivisionLink).toBeVisible();

    const subDivisionName = await subDivisionLink.innerText();
    const subDivisionHref = await subDivisionLink.getAttribute("href");
    await subDivisionLink.click();

    await page.waitForURL("**" + subDivisionHref);
    await genericPage.waitUntilLoaded(page, subDivisionName);
  });
});
