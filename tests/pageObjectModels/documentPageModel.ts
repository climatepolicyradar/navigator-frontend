import { expect, type Page } from "@playwright/test";

import { TTextMatch } from "./types";

export const documentPageModel = {
  goToDocument: async (page: Page, slugAndParams: string): Promise<void> => {
    await page.goto("/documents/" + slugAndParams);
  },

  ensureAccordionOpen: async (page: Page, name: string) => {
    const accordion = page.getByRole("button", { name });

    const isExpanded = await accordion.getAttribute("aria-expanded");

    if (isExpanded !== "true") {
      await accordion.click();
    }

    expect(accordion).toHaveAttribute("aria-expanded", "true");
  },

  waitUntilLoaded: async (page: Page, title?: TTextMatch): Promise<void> => {
    // the adobe reader takes a while to load sometimes so waiting for all network calls
    // to complete causes timing issues and test flakiness on the document page
    await page.waitForLoadState("load");
    await expect(page.getByRole("heading", { name: title, level: 1 })).toBeVisible();
  },
};
