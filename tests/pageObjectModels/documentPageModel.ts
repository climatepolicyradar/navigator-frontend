import { expect, type Page } from "@playwright/test";

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
};
