import { test, expect } from "@playwright/test";

test("search filters", async ({ page }) => {
  await page.route("*/**/api/v1/config", async (route) => {
    const json = {
      geographies: [
        {
          node: {
            id: 1,
            display_value: "South Asia",
            slug: "south-asia",
            value: "South Asia",
            type: "World Bank Region",
            parent_id: null,
          },
          children: [
            {
              node: {
                id: 2,
                display_value: "Afghanistan",
                slug: "afghanistan",
                value: "AFG",
                type: "ISO-3166",
                parent_id: 1,
              },
              children: [],
            },
          ],
        },
      ],
      organisations: {
        CCLW: {
          corpora: [
            {
              taxonomy: {
                topic: {
                  allow_any: false,
                  allow_blanks: true,
                  allowed_values: ["Mitigation"],
                },
                sector: {
                  allow_any: false,
                  allow_blanks: true,
                  allowed_values: ["Energy"],
                },
              },
            },
          ],
        },
      },
    };

    await route.fulfill({ json });
  });

  await page.goto("/search");

  await expect(page.getByRole("heading", { name: "Search results" })).toBeVisible();
  await expect(page.getByText("FILTERS").last()).toBeVisible();

  await expect(page.locator('[data-cy="categories"]:has-text("Category")').last()).toBeVisible();

  const allCategoriesRadioButton = page.getByRole("radio", { name: "All" });
  expect(allCategoriesRadioButton.isChecked()).toBeTruthy();

  await expect(page.locator('[data-cy="regions"]:has-text("Region")').last()).toBeVisible();
  await expect(page.locator('[data-cy="countries"]:has-text("Published jurisdiction")').last()).toBeVisible();
  await expect(page.locator('[data-cy="date-range"]:has-text("Date")').last()).toBeVisible();

  const policiesRadioButton = page.getByRole("radio", { name: "Policies" });
  await policiesRadioButton.click();
  expect(policiesRadioButton.isChecked()).toBeTruthy();

  await expect(page.locator('[data-cy="Topic"]:has-text("Topic")').last()).toBeVisible();
  await expect(page.locator('[data-cy="Sector"]:has-text("Sector")').last()).toBeVisible();
});
