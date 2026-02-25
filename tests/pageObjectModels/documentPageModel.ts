import { type Page } from "@playwright/test";

export const documentPageModel = {
  goToDocument: async (page: Page, slugAndParams: string): Promise<void> => {
    await page.goto("/documents/" + slugAndParams);
  },
};
