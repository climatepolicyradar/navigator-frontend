import { expect, type Page } from "@playwright/test";

import { TTextMatch } from "./types";

export const collectionPageModel = {
  waitUntilLoaded: async (page: Page, title?: TTextMatch): Promise<void> => {
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: title, level: 1 })).toBeVisible();
  },

  goToCollection: async (page: Page, slugAndParams: string): Promise<void> => {
    await page.goto("/collections/" + slugAndParams);
  },

  async dismissOverlays(page: Page) {
    // Close welcome modal if present
    const understand = page.getByRole("button", { name: "I understand" });
    if (await understand.isVisible().catch(() => false)) {
      await understand.click();
    }
    // Accept cookies if present
    const accept = page.getByRole("button", { name: "Accept" });
    if (await accept.isVisible().catch(() => false)) {
      await accept.click();
    }
  },
};
