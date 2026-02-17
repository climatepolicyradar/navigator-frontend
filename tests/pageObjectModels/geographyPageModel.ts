import { Locator, type Page } from "@playwright/test";

import { TTextMatch } from "./types";

export const geographyPageModel = {
  goToGeography: async (page: Page, slugAndParams: string): Promise<void> => {
    await page.goto("/geographies/" + slugAndParams);
  },

  focusOnSection: async (page: Page, title: TTextMatch): Promise<Locator> => {
    const section = page.getByRole("region").filter({ has: page.getByRole("heading", { name: title }) });
    await expect(section).toBeVisible();
    return section;
  },
};
