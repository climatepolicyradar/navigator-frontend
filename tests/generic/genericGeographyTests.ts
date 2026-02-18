import { expect, test } from "@playwright/test";

import { TTheme } from "@/types";

import { genericPageModel as genericPage } from "../pageObjectModels/genericPageModel";
import { geographyPageModel as geographyPage } from "../pageObjectModels/geographyPageModel";

type TGeographyThemeConfig = {
  theme: TTheme;
  geographySlug: string;
  recentSectionRegex: RegExp;
};

const GEOGRAPHY_THEME_CONFIG: TGeographyThemeConfig[] = [
  {
    theme: "ccc",
    geographySlug: "united-states-of-america",
    recentSectionRegex: /^Recent cases/,
  },
  {
    theme: "cclw",
    geographySlug: "denmark",
    recentSectionRegex: /^Recent documents/,
  },
  {
    theme: "cpr",
    geographySlug: "australia",
    recentSectionRegex: /^Recent documents/,
  },
  {
    theme: "mcf",
    geographySlug: "barbados",
    recentSectionRegex: /^Recent documents/,
  },
];

export const runGenericGeographyTests = (theme: TTheme) => {
  const config = GEOGRAPHY_THEME_CONFIG.find((c) => c.theme === theme);

  if (!config) {
    throw new Error(`No geography config found for theme: ${theme}`);
  }

  test.describe(`Generic geography tests - ${theme}`, () => {
    test("navigate to a family from the geography page", async ({ page }) => {
      await geographyPage.goToGeography(page, config.geographySlug);
      await genericPage.waitUntilLoaded(page);
      await genericPage.dismissPopups(page);

      const recentDocumentsSection = await geographyPage.focusOnSection(page, config.recentSectionRegex);

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
