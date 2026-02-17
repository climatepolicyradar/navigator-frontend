import { Page } from "@playwright/test";

import { TTextMatch } from "./types";

export const genericPageModel = {
  dismissPopups: async (page: Page): Promise<void> => {
    // Tutorial modal
    const tutorialModalCloseButton = page.getByTitle("Dismiss modal");
    if (await tutorialModalCloseButton.nth(1).isVisible()) {
      await tutorialModalCloseButton.nth(1).click();
    }

    // Tutorial banner
    const tutorialBannerCloseButton = page.getByTitle("Dismiss banner");
    if (await tutorialBannerCloseButton.isVisible()) {
      await tutorialBannerCloseButton.click();
    }

    // Cookie consent
    const cookieConsentRejectButton = page.getByTitle("Reject cookies");
    if (await cookieConsentRejectButton.isVisible()) {
      await cookieConsentRejectButton.click();
    }
  },

  waitUntilLoaded: async (page: Page, title?: TTextMatch): Promise<void> => {
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: title, level: 1 })).toBeVisible();
  },
};
