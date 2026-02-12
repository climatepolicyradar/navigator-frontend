import { expect, Locator, type Page } from "@playwright/test";

import { TTextFilter, TTextMatch } from "./types";

export const familyPageModel = {
  focusOnDrawer: async (page: Page, title: TTextMatch): Promise<Locator> => {
    const drawer = page.getByRole("dialog");
    await expect(drawer.filter({ has: page.getByRole("heading", { name: title }) })).toBeVisible();
    return drawer;
  },

  focusOnSection: async (page: Page, title: TTextMatch): Promise<Locator> => {
    const section = page.getByRole("region").filter({ has: page.getByRole("heading", { name: title }) });
    await expect(section).toBeVisible();
    return section;
  },

  getTopicButton: async (locator: Locator | Page, filter: TTextFilter): Promise<Locator> => {
    const topic = locator.getByRole("button").filter(filter).first();
    await expect(topic).toBeVisible();
    return topic;
  },

  goToFamily: async (page: Page, slugAndParams: string): Promise<void> => {
    await page.goto("/document/" + slugAndParams);
  },

  waitUntilLoaded: async (page: Page, title?: TTextMatch): Promise<void> => {
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: title, level: 1 })).toBeVisible();
  },
};
