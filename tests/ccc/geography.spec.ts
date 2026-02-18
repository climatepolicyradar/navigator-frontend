import { test, expect } from "@playwright/test";

import { genericPageModel as genericPage } from "../pageObjectModels/genericPageModel";
import { geographyPageModel as geographyPage } from "../pageObjectModels/geographyPageModel";

test.describe("CCC geography page", () => {
  test.describe("Generic geography tests", () => {
    test("navigate to a family from the geography page", async ({ page }) => {
      await geographyPage.goToGeography(page, "australia");
      await genericPage.waitUntilLoaded(page);
      await genericPage.dismissPopups(page);

      const recentDocumentsSection = await geographyPage.focusOnSection(page, /^Recent cases/);

      const familyLink = recentDocumentsSection.getByRole("link").first();
      await expect(familyLink).toBeVisible();

      const familyNameRaw = await familyLink.innerText();
      const familyName = familyNameRaw.split("\n")[0].trim();
      const familyHref = await familyLink.getAttribute("href");

      await familyLink.click();

      await page.waitForURL("**" + familyHref);
      await genericPage.waitUntilLoaded(page, familyName);
    });
  });

  test("should navigate to to family page from sub division page", async ({ page }) => {
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

    const recentDocumentsSection = await geographyPage.focusOnSection(page, /^Recent cases/);

    const familyLink = recentDocumentsSection.getByRole("link").first();
    await expect(familyLink).toBeVisible();

    const familyNameRaw = await familyLink.innerText();
    const familyName = familyNameRaw.split("\n")[0].trim();
    const familyHref = await familyLink.getAttribute("href");

    await familyLink.click();

    await page.waitForURL("**" + familyHref);
    await genericPage.waitUntilLoaded(page, familyName);
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

  test("should navigate to related sub division geography page", async ({ page }) => {
    await geographyPage.goToGeography(page, "br-rj");

    await genericPage.waitUntilLoaded(page);
    await genericPage.dismissPopups(page);

    const subDivisionSection = await geographyPage.focusOnSection(page, /^Related geographic sub-divisions/);
    const subDivisionLink = subDivisionSection.getByRole("link").first();
    await expect(subDivisionLink).toBeVisible();

    const subDivisionName = await subDivisionLink.innerText();
    const subDivisionHref = await subDivisionLink.getAttribute("href");
    await subDivisionLink.click();

    await page.waitForURL("**" + subDivisionHref);
    await genericPage.waitUntilLoaded(page, subDivisionName);
  });
});
