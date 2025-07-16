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
      corpus_types: {
        // add more corpus types and different taxonomies
        "Laws and Policies": {
          taxonomy: {
            topic: {
              allowed_values: ["Mitigation"],
            },
            sector: {
              allowed_values: ["Energy"],
            },
          },
          corpora: [],
        },
        "Intl. agreements": {
          taxonomy: {
            author: {
              allowed_values: [],
            },
            author_type: {
              allowed_values: ["Party"],
            },
          },
          corpora: [],
        },
      },
    };

    await route.fulfill({ json });
  });

  await Promise.all([page.goto("/search"), page.waitForResponse("**/searches")]);

  await expect(page.getByRole("heading", { name: "Search results" })).toBeVisible();
  await expect(page.getByText("FILTERS").first()).toBeVisible();

  await expect(page.locator('[data-cy="categories"]:has-text("Document Type")').last()).toBeVisible();

  const allCategoriesRadioButton = page.getByRole("radio", { name: "All" });
  expect(allCategoriesRadioButton.isChecked()).toBeTruthy();

  await expect(page.locator('[data-cy="date-range"]:has-text("Date")').last()).toBeVisible();

  const policiesRadioButton = page.getByRole("radio", { name: "Policies" });
  await policiesRadioButton.click();
  expect(policiesRadioButton.isChecked()).toBeTruthy();

  const responseAreasAccordion = page.locator('[data-cy="Response areas"]:has-text("Response areas")').last();
  await expect(responseAreasAccordion).toBeVisible();
  await responseAreasAccordion.click();
  await expect(page.getByRole("radio", { name: "Mitigation" })).toBeVisible();

  const sectorAccordion = page.locator('[data-cy="Sector"]:has-text("Sector")').last();
  await expect(sectorAccordion).toBeVisible();
  sectorAccordion.click();
  await expect(page.getByRole("radio", { name: "Energy" })).toBeVisible();

  await page.getByRole("button", { name: "Geography" }).click();
  await expect(page.getByText("Region")).toBeVisible();
  await expect(page.getByText("Published jurisdiction")).toBeVisible();
});
