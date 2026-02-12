import { expect, type Page } from "@playwright/test";

import { TTextMatch } from "./types";

export const documentPageModel = {
  waitUntilLoaded: async (page: Page, title?: TTextMatch): Promise<void> => {
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: title, level: 1 })).toBeVisible();
  },
};
