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
    await expect(page.getByRole("heading", { name: "Search results" })).toBeVisible();

    // Verify the category filter is applied using correct URL parameters
    const url = page.url();
    expect(url).toContain("c=offshore-wind-reports");
    expect(url).toContain("e=true");
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
    expect(url).toContain("e=true");

    // Verify we're on the search page
    await expect(page.getByRole("heading", { name: "Search results" })).toBeVisible();
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
    expect(url).toContain("e=true");
    await expect(page.getByRole("heading", { name: "Search results" })).toBeVisible();
  });

  test("should handle search suggestions correctly", async ({ page }) => {
    // Test clicking on "Offshore wind development" suggestion - use more specific selector
    const suggestion = page.getByRole("link", { name: "Offshore wind development" }).first();
    await suggestion.click();

    // Should navigate to search page with the suggestion as query
    await page.waitForURL("/search*");

    // Verify the suggestion term is in the URL using correct parameters
    const url = page.url();
    expect(url).toContain("q=Offshore+wind+development");
    expect(url).toContain("c=offshore-wind-reports");
    expect(url).toContain("e=true");
    await expect(page.getByRole("heading", { name: "Search results" })).toBeVisible();
  });

  test("should handle special suggestion with concept_name parameter", async ({ page }) => {
    // Test clicking on "Zoning and spatial planning" suggestion
    const suggestion = page.getByRole("link", { name: "Zoning and spatial planning" }).first();
    await suggestion.click();

    // Should navigate to search page with the special parameters
    await page.waitForURL("/search*");

    // Verify the special parameters are in the URL using correct parameters
    // This suggestion uses concept_name instead of query_string
    const url = page.url();
    expect(url).toContain("cfn=zoning+and+spatial+planning");
    expect(url).toContain("c=offshore-wind-reports");
    expect(url).toContain("e=true");
    await expect(page.getByRole("heading", { name: "Search results" })).toBeVisible();
  });

  test("should clear search input after navigation", async ({ page }) => {
    const searchInput = page.locator('[data-cy="search-input"]');

    // Type a search term and perform search
    await searchInput.fill("test search term");
    await searchInput.press("Enter");

    // Wait for navigation to complete
    await page.waitForURL("/search*");

    // Navigate back to OEP page
    await page.goBack();

    // Wait for page to load and verify search input is cleared
    await page.waitForLoadState("networkidle");
    await expect(searchInput).toHaveValue("");
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
    expect(url).toContain("e=true");
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
    expect(url).toContain("e=true");
    await expect(page.getByRole("heading", { name: "Search results" })).toBeVisible();
  });
});
