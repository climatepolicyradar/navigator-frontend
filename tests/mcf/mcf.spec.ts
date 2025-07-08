import { test, expect } from "@playwright/test";

// Helper to match app's URL encoding behavior
function urlify(str: string) {
  // The app uses encodeURIComponent but replaces %20 with + for spaces
  return encodeURIComponent(str).replace(/%20/g, "+");
}

/**
 * MCF Hero Search E2E Tests
 *
 * Tests the search functionality on the MCF homepage hero section,
 * covering various user journeys and edge cases to prevent regressions.
 */

test.describe("MCF Hero Search", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to MCF homepage
    await page.goto("/");

    // Wait for the page to load completely
    await page.waitForLoadState("networkidle");

    // Verify we're on the MCF homepage by checking the hero section
    await expect(page.getByRole("heading", { name: "Multilateral Climate Funds" })).toBeVisible();
  });

  test("should handle empty search gracefully", async ({ page }) => {
    // Click search button with empty input
    await page.click('[data-cy="search-form"] button[aria-label="Search"]');

    // Should not crash - page should remain on homepage
    await expect(page).not.toHaveURL(/e=true/);
    await expect(page.getByRole("heading", { name: "Multilateral Climate Funds" })).toBeVisible();
  });

  test("should search with button click", async ({ page }) => {
    const searchTerm = "climate adaptation";

    // Type search term
    await page.fill('[data-cy="search-input"]', searchTerm);

    // Click search button
    await page.click('[data-cy="search-form"] button[aria-label="Search"]');

    // Should navigate to search results page
    await expect(page).toHaveURL(/\/search/);

    // Should have correct query parameters
    await expect(page).toHaveURL(/q=climate\+adaptation/);
    await expect(page).not.toHaveURL(/e=true/);
  });

  test("should search with Enter key", async ({ page }) => {
    const searchTerm = "renewable energy";

    // Type search term and press Enter
    await page.fill('[data-cy="search-input"]', searchTerm);
    await page.press('[data-cy="search-input"]', "Enter");

    // Should navigate to search results page
    await expect(page).toHaveURL(/\/search/);

    // Should have correct query parameters
    await expect(page).toHaveURL(/q=renewable\+energy/);
    await expect(page).not.toHaveURL(/e=true/);
  });

  test("should handle search suggestions correctly", async ({ page }) => {
    // Test clicking on "Adaptation" suggestion button
    await page.click('[data-cy="example-search-1"]');

    // Should navigate to search page with the suggestion as query
    await page.waitForURL("/search*");

    // Verify the suggestion term is in the URL using correct parameters
    const url = page.url();
    expect(url).toContain("q=Adaptation");
    expect(url).not.toContain("e=true");
    await expect(page.getByRole("heading", { name: "Search results" })).toBeVisible();

    // Navigate back to homepage for next test
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Test clicking on "Extreme Weather" suggestion button
    await page.click('[data-cy="example-search-2"]');

    // Should navigate to search page with the suggestion as query
    await page.waitForURL("/search*");

    // Verify the suggestion term is in the URL using correct parameters
    const url2 = page.url();
    expect(url2).toContain("q=Extreme+Weather");
    expect(url2).not.toContain("e=true");
    await expect(page.getByRole("heading", { name: "Search results" })).toBeVisible();

    // Navigate back to homepage for next test
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Test clicking on "Philippines" suggestion button
    await page.click('[data-cy="example-search-3"]');

    // Should navigate to search page with the special parameters
    await page.waitForURL("/search*");

    // Verify the special parameters are in the URL using correct parameters
    // This suggestion uses country parameter instead of query_string
    const url3 = page.url();
    expect(url3).toContain("l=philippines");
    expect(url3).not.toContain("e=true");
    await expect(page.getByRole("heading", { name: "Search results" })).toBeVisible();
  });

  test("should handle special characters in search", async ({ page }) => {
    const searchTerm = "climate (adaptation)";

    // Type search term with special characters
    await page.fill('[data-cy="search-input"]', searchTerm);

    // Click search button
    await page.click('[data-cy="search-form"] button[aria-label="Search"]');

    // Should navigate to search results page
    await expect(page).toHaveURL(/\/search/);

    // Should have correctly encoded query parameters
    await expect(page).toHaveURL(/q=climate\+%28adaptation%29/);
    await expect(page).not.toHaveURL(/e=true/);
  });

  test("should handle long search terms", async ({ page }) => {
    const longSearchTerm = "multilateral climate fund adaptation projects in developing countries";

    // Type long search term
    await page.fill('[data-cy="search-input"]', longSearchTerm);

    // Click search button
    await page.click('[data-cy="search-form"] button[aria-label="Search"]');

    // Should navigate to search results page
    await expect(page).toHaveURL(/\/search/);

    // Should have correctly encoded query parameters
    await expect(page).toHaveURL(/q=multilateral\+climate\+fund\+adaptation\+projects\+in\+developing\+countries/);
    await expect(page).not.toHaveURL(/e=true/);
  });

  test("should clear input when navigating back", async ({ page }) => {
    const searchTerm = "test search";

    // Type search term
    await page.fill('[data-cy="search-input"]', searchTerm);

    // Click search button
    await page.click('[data-cy="search-form"] button[aria-label="Search"]');

    // Should navigate to search results page
    await expect(page).toHaveURL(/\/search/);

    // Navigate back to homepage
    await page.goto("/");

    // Input should be cleared
    await expect(page.locator('[data-cy="search-input"]')).toHaveValue("");
  });

  test("should handle example search buttons", async ({ page }) => {
    // Click on "Adaptation" example search
    await page.click('[data-cy="example-search-1"]');

    // Should navigate to search results page
    await expect(page).toHaveURL(/\/search/);

    // Should have correct query parameters
    await expect(page).toHaveURL(/q=Adaptation/);
    await expect(page).not.toHaveURL(/e=true/);
  });

  test("should handle country example search", async ({ page }) => {
    // Click on "Philippines" example search
    await page.click('[data-cy="example-search-3"]');

    // Should navigate to search results page
    await expect(page).toHaveURL(/\/search/);

    // Should have correct query parameters for country search
    await expect(page).toHaveURL(/l=philippines/);
    await expect(page).not.toHaveURL(/e=true/);
  });

  test("should maintain search state on page refresh", async ({ page }) => {
    const searchTerm = "climate finance";

    // Type search term
    await page.fill('[data-cy="search-input"]', searchTerm);

    // Click search button
    await page.click('[data-cy="search-form"] button[aria-label="Search"]');

    // Should navigate to search results page
    await expect(page).toHaveURL(/\/search/);

    // Refresh the page
    await page.reload();

    // Should still be on search results page with same parameters
    await expect(page).toHaveURL(/\/search/);
    await expect(page).toHaveURL(/q=climate\+finance/);
    await expect(page).not.toHaveURL(/e=true/);
  });
});
