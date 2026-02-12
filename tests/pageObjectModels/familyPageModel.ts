import { expect, type Page } from "@playwright/test";

export class FamilyPageModel {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goToFamilyPage(slugAndParams: string) {
    await this.page.goto("/document/" + slugAndParams);
  }

  async waitForPageLoad(title?: string) {
    await this.page.waitForLoadState("networkidle");
    await expect(this.page.getByRole("heading", { name: title, level: 1 })).toBeVisible();
  }
}
