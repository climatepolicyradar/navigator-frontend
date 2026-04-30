import { expect, type Page } from "@playwright/test";

import { TTextMatch } from "./types";

export const genericPageModel = {
  dismissPopups: async (page: Page): Promise<void> => {
    const dismiss = async (locator: ReturnType<Page["getByTitle"]>) => {
      await locator.waitFor({ state: "visible", timeout: 3000 }).catch(() => {});
      if (await locator.isVisible()) {
        await locator.click();
      }
    };

    // Tutorial modal
    await dismiss(page.getByTitle("Dismiss modal").nth(1));
    // Tutorial banner
    await dismiss(page.getByTitle("Dismiss banner"));
    // Cookie consent
    await dismiss(page.getByTitle("Reject cookies"));
  },

  waitUntilLoaded: async (page: Page, title?: TTextMatch): Promise<void> => {
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: title, level: 1 })).toBeVisible();
  },
};
