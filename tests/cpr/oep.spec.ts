import { test, expect } from "@playwright/test";

/* Debugging Failed Tests
1. Run with `--headed` flag to see browser
2. Use `--debug` flag for step-by-step debugging
3. Check browser console for errors (e.g. "Error: Navigation failed because page did not fully load.")
4. Verify test environment matches expected state
5. Check for any console.error() calls in the browser console
*/

// Helper to match app's URL encoding behavior
function urlify(str: string) {
  // The app uses encodeURIComponent but replaces %20 with + for spaces
  return encodeURIComponent(str).replace(/%20/g, "+");
}

/**
 * OEP Landing Page Search E2E Tests
 *
 * These tests cover the critical user journeys for the OEP Landing Page search functionality,
 * including the bug fixes for empty search crashes and search term handling.
 */

test.describe("OEP Landing Page Search", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the OEP page
    await page.goto("/offshorewind");

    // Handle consent banner if present
    const consentHeading = page.getByText("Cookies and your privacy");
    if (await consentHeading.isVisible()) {
      const consentBanner = page.locator("div").filter({ has: consentHeading });
      await consentBanner.getByRole("button", { name: "Reject" }).click();
    }
  });

  test("should display OEP Hero page with search functionality", async ({ page }) => {
    // Branding and content
    await expect(page.getByRole("heading", { name: "POWER Library", exact: true })).toBeVisible();
    await expect(page.getByText("Helping the offshore wind sector design effective strategies")).toBeVisible();

    // OEP logo (first instance)
    await expect(page.locator('[data-cy="oep-logo"]').first()).toBeVisible();

    // Search input
    const searchInput = page.locator('[data-cy="search-input"]');
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveAttribute("placeholder", "Search...");

    // Search button
    const searchButton = page.locator('button[aria-label="Search"]');
    await expect(searchButton).toBeVisible();

    // Suggestions
    await expect(page.getByText("Suggestions:")).toBeVisible();
    await expect(page.getByRole("link", { name: "Offshore wind development" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Floating offshore wind" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Zoning and spatial planning" })).toBeVisible();
  });

  test("should handle empty search without crashing", async ({ page }) => {
    // This test captures the critical bug fix - clicking search with empty input
    const searchButton = page.locator('button[aria-label="Search"]');

    // Click search button with empty input - should not crash
    await searchButton.click();

    // Should navigate to search page with category filter but no query
    await page.waitForURL("/search*");
    await expect(page.getByRole("listitem").filter({ hasText: "Search results" })).toBeVisible();

    // Verify the category filter is applied using correct URL parameters
    const url = page.url();
    expect(url).toContain("c=offshore-wind-reports");
    expect(url).not.toContain("e=true");
  });

  test("should perform search with user input via search button", async ({ page }) => {
    const searchInput = page.locator('[data-cy="search-input"]');
    const searchButton = page.locator('button[aria-label="Search"]');

    // Type a search term
    const searchTerm = "floating wind turbines";
    await searchInput.fill(searchTerm);

    // Click search button
    await searchButton.click();

    // Should navigate to search page with the search term
    await page.waitForURL("/search*");

    // Verify the search term is in the URL using correct parameters
    const url = page.url();
    expect(url).toContain(`q=${urlify(searchTerm)}`);
    expect(url).toContain("c=offshore-wind-reports");
    expect(url).not.toContain("e=true");

    // Verify we're on the search page
    await expect(page.getByRole("listitem").filter({ hasText: "Search results" })).toBeVisible();
  });

  test("should perform search with user input via Enter key", async ({ page }) => {
    const searchInput = page.locator('[data-cy="search-input"]');

    // Type a search term
    const searchTerm = "offshore wind policy";
    await searchInput.fill(searchTerm);

    // Press Enter key
    await searchInput.press("Enter");

    // Should navigate to search page with the search term
    await page.waitForURL("/search*");

    // Verify the search term is in the URL using correct parameters
    const url = page.url();
    expect(url).toContain(`q=${urlify(searchTerm)}`);
    expect(url).toContain("c=offshore-wind-reports");
    expect(url).not.toContain("e=true");
    await expect(page.getByRole("listitem").filter({ hasText: "Search results" })).toBeVisible();
  });

  test("should handle search suggestions correctly", async ({ page }) => {
    // Test clicking on "Offshore wind development" suggestion
    const suggestion = page.getByRole("link", { name: "Offshore wind development" }).first();
    await suggestion.click();

    // Should navigate to search page with the suggestion as query
    await page.waitForURL("/search*");

    // Verify the suggestion term is in the URL using correct parameters
    const url = page.url();
    expect(url).toContain("q=Offshore+wind+development");
    expect(url).toContain("c=offshore-wind-reports");
    expect(url).not.toContain("e=true");
    await expect(page.getByRole("listitem").filter({ hasText: "Search results" })).toBeVisible();

    // Navigate back to homepage for next test
    await page.goto("/offshorewind");
    await page.waitForLoadState("networkidle");

    // Test clicking on "Floating offshore wind" suggestion
    const suggestion2 = page.getByRole("link", { name: "Floating offshore wind" }).first();
    await suggestion2.click();

    // Should navigate to search page with the suggestion as query
    await page.waitForURL("/search*");

    // Verify the suggestion term is in the URL using correct parameters
    const url2 = page.url();
    expect(url2).toContain("q=Floating+offshore+wind");
    expect(url2).toContain("c=offshore-wind-reports");
    expect(url2).not.toContain("e=true");
    await expect(page.getByRole("listitem").filter({ hasText: "Search results" })).toBeVisible();

    // Navigate back to homepage for next test
    await page.goto("/offshorewind");
    await page.waitForLoadState("networkidle");

    // Test clicking on "Zoning and spatial planning" suggestion
    const suggestion3 = page.getByRole("link", { name: "Zoning and spatial planning" }).first();
    await suggestion3.click();

    // Should navigate to search page with the special parameters
    await page.waitForURL("/search*");

    // Verify the special parameters are in the URL using correct parameters
    // This suggestion uses concept_name instead of query_string
    const url3 = page.url();
    expect(url3).toContain("cfn=zoning+and+spatial+planning");
    expect(url3).toContain("c=offshore-wind-reports");
    expect(url3).not.toContain("e=true");
    await expect(page.getByRole("listitem").filter({ hasText: "Search results" })).toBeVisible();
  });

  test("should handle search with special characters", async ({ page }) => {
    const searchInput = page.locator('[data-cy="search-input"]');
    const searchButton = page.locator('button[aria-label="Search"]');

    // Test search with special characters
    const searchTerm = "wind & solar energy (2023)";
    await searchInput.fill(searchTerm);
    await searchButton.click();

    // Should navigate to search page with properly encoded search term
    await page.waitForURL("/search*");

    // Verify the search term is properly encoded in the URL using correct parameters
    const url = page.url();
    expect(url).toContain("q=wind+%26+solar+energy+%282023%29");
    expect(url).toContain("c=offshore-wind-reports");
    expect(url).not.toContain("e=true");
  });

  test("should handle very long search terms", async ({ page }) => {
    const searchInput = page.locator('[data-cy="search-input"]');
    const searchButton = page.locator('button[aria-label="Search"]');

    // Test search with a very long term
    const longSearchTerm =
      "offshore wind energy development and environmental impact assessment for sustainable renewable energy projects in coastal regions";
    await searchInput.fill(longSearchTerm);
    await searchButton.click();

    // Should navigate to search page without crashing
    await page.waitForURL("/search*");

    // Verify the search term is in the URL using correct parameters
    const url = page.url();
    expect(url).toContain(
      "q=offshore+wind+energy+development+and+environmental+impact+assessment+for+sustainable+renewable+energy+projects+in+coastal+regions"
    );
    expect(url).toContain("c=offshore-wind-reports");
    expect(url).not.toContain("e=true");
    await expect(page.getByRole("listitem").filter({ hasText: "Search results" })).toBeVisible();
  });

  test("should maintain search state on page refresh", async ({ page }) => {
    const searchTerm = "energy development";

    // Type search term
    await page.fill('[data-cy="search-input"]', searchTerm);

    // Click search button
    const searchButton = page.locator('button[aria-label="Search"]');
    await searchButton.click();
    await page.waitForURL("/search*");

    // Should navigate to search results page
    await expect(page).toHaveURL(/\/search/);

    // Wait for the page to be fully loaded before refresh
    await page.waitForLoadState("networkidle");

    // Refresh the page with explicit wait
    await page.reload({ waitUntil: "networkidle" });

    // Should still be on search results page with same parameters
    await expect(page).toHaveURL(/\/search/);
    await expect(page).toHaveURL(/q=energy\+development/);
    await expect(page).toHaveURL(/c=offshore-wind-reports/);
    await expect(page).not.toHaveURL(/e=true/);
  });

  test("should not maintain search state on Home breadcrumb click", async ({ page }) => {
    const searchTerm = "avoidance";

    // Type search term
    await page.fill('[data-cy="search-input"]', searchTerm);

    // Click search button
    const searchButton = page.locator('button[aria-label="Search"]');
    await searchButton.click();
    await page.waitForURL("/search*");

    // Should navigate to search results page
    await expect(page).toHaveURL(/\/search/);

    // Navigate back to homepage via breadcrumb
    await page.click('[data-cy="breadcrumb home"] a');

    // Should now be on the CPR homepage with same parameters
    await expect(page.getByText("Helping the offshore wind sector design effective strategies")).not.toBeVisible();
    await expect(page).not.toHaveURL(/\/search/);
    await expect(page).not.toHaveURL(/q=avoidance/);
    await expect(page).not.toHaveURL(/c=offshore-wind-reports/);
    await expect(page).not.toHaveURL(/e=true/);

    // Verify the search input is not cleared
    const searchInput = page.locator('[data-cy="search-input"]');
    await expect(searchInput).toHaveValue("");
    await expect(searchInput).not.toHaveValue(searchTerm);
  });

  test("should perform query string search if geography is typed", async ({ page }) => {
    const searchTerm = "india";

    // Type a country name
    await page.fill('[data-cy="search-input"]', searchTerm);

    // We don't expect to see a dropdown or suggested geography profile
    await expect(page.getByRole("link", { name: "India Geography profile" })).not.toBeVisible();

    // Click search button
    const searchButton = page.locator('button[aria-label="Search"]');
    await searchButton.click();
    await page.waitForURL("/search*");

    // Should navigate to search results page
    await expect(page).toHaveURL(/\/search/);

    // Verify the search term is in the URL using correct parameters
    const url = page.url();
    expect(url).toContain("q=india");
    expect(url).toContain("c=offshore-wind-reports");
    expect(url).not.toContain("e=true");
    expect(url).not.toContain("l=india");
    expect(url).not.toContain("/geographies/india");
    await expect(page.getByRole("listitem").filter({ hasText: "Search results" })).toBeVisible();
  });

  test("should not show dropdown when typing country with additional terms", async ({ page }) => {
    const searchTerm = "renewable energy france";
    await page.fill('[data-cy="search-input"]', searchTerm);

    // Verify "Did you mean" suggestion for France is not visible
    await expect(page.getByText("Did you mean to search for renewable energy in France")).not.toBeVisible();
    await expect(page.getByRole("link", { name: "France Geography profile" })).not.toBeVisible();

    // Click search button
    const searchButton = page.locator('button[aria-label="Search"]');
    await searchButton.click();

    // Should navigate to search page with the suggestion parameters
    await page.waitForURL("/search*");

    // Verify the search term and country filter are applied
    const url = page.url();
    expect(url).toContain("q=renewable+energy+france");
    expect(url).not.toContain("l=france");
    expect(url).not.toContain("e=true");
    await expect(page.getByRole("listitem").filter({ hasText: "Search results" })).toBeVisible();
  });

  test("should handle search with multiple parameters", async ({ page }) => {
    const searchInput = page.locator('[data-cy="search-input"]');
    const searchButton = page.locator('button[aria-label="Search"]');

    // Type a search term that might trigger multiple filters
    const searchTerm = "renewable energy france";
    await searchInput.fill(searchTerm);
    await searchButton.click();
    await page.waitForURL("/search*");

    // Should navigate to search results page
    await expect(page).toHaveURL(/\/search/);

    // Should have correct query parameters
    await expect(page).toHaveURL(/q=renewable\+energy\+france/);
    await expect(page).not.toHaveURL(/l=france/);
    await expect(page).toHaveURL(/c=offshore-wind-reports/);
    await expect(page).not.toHaveURL(/e=true/);
  });
});
