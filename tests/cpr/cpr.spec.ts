import { test, expect } from "@playwright/test";

// Helper to match app's URL encoding behavior
function urlify(str: string) {
  // The app uses encodeURIComponent but replaces %20 with + for spaces
  return encodeURIComponent(str).replace(/%20/g, "+");
}

/**
 * CPR Hero Search E2E Tests
 *
 * These tests cover the critical user journeys for the CPR Landing Page
 * search functionality, including both regular and knowledge graph search modes.
 */

test.describe("CPR Hero Search", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the CPR homepage
    await page.goto("/");

    // Handle consent banner if present
    const consentHeading = page.getByText("Cookies and your privacy");
    if (await consentHeading.isVisible()) {
      const consentBanner = page.locator("div").filter({ has: consentHeading });
      await consentBanner.getByRole("button", { name: "Reject" }).click();
    }

    // Wait for the page to load completely
    await page.waitForLoadState("networkidle");

    // Verify we're on the CPR homepage by checking the Alpha logo
    await expect(page.locator('[data-cy="cpr-logo"]')).toBeVisible();
    await expect(page.locator('[data-cy="search-input"]')).toHaveAttribute("placeholder", "Search the full text of over 12,000 climate documents");
  });

  test("should display CPR Hero page with search functionality", async ({ page }) => {
    // Branding and content
    await expect(page.locator('[data-cy="cpr-logo"]')).toBeVisible();

    // Search input
    const searchInput = page.locator('[data-cy="search-input"]');
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveAttribute("placeholder", "Search the full text of over 12,000 climate documents");

    // Search button
    const searchButton = page.locator('button[aria-label="Search"]');
    await expect(searchButton).toBeVisible();

    // Search form
    await expect(page.locator('[data-cy="search-form"]')).toBeVisible();

    // Exact match checkbox should not exist
    await expect(page.locator("#exact-match")).not.toBeAttached();

    // Quick search suggestions
    await expect(page.getByText("Try these searches")).toBeVisible();
  });

  test("should handle empty search without crashing", async ({ page }) => {
    // Click search button with empty input
    await page.click('[data-cy="search-form"] button[aria-label="Search"]');

    // Should not crash - should redirect to /search
    await expect(page).not.toHaveURL(/e=true/);
    await expect(page).toHaveURL(/search/);
    await expect(page.getByText("Search the full text of over 12,000 climate documents")).not.toBeVisible();
  });

  test("should perform search with user input via search button", async ({ page }) => {
    const searchInput = page.locator('[data-cy="search-input"]');
    const searchButton = page.locator('button[aria-label="Search"]');

    // Type a search term
    const searchTerm = "climate adaptation laws";
    await searchInput.fill(searchTerm);

    // Click search button
    await searchButton.click();

    // Should navigate to search page with the search term
    await page.waitForURL("/search*");

    // Verify the search term is in the URL using correct parameters
    const url = page.url();
    expect(url).toContain(`q=${urlify(searchTerm)}`);
    expect(url).not.toContain("e=true");

    // Verify we're on the search page
    await expect(page.getByRole("listitem").filter({ hasText: "Search results" })).toBeVisible();
  });

  test("should perform search with user input via Enter key", async ({ page }) => {
    const searchInput = page.locator('[data-cy="search-input"]');

    // Type a search term
    const searchTerm = "renewable energy policy";
    await searchInput.fill(searchTerm);

    // Press Enter key
    await searchInput.press("Enter");

    // Should navigate to search page with the search term
    await page.waitForURL("/search*");

    // Verify the search term is in the URL using correct parameters
    const url = page.url();
    expect(url).toContain(`q=${urlify(searchTerm)}`);
    expect(url).not.toContain("e=true");
    await expect(page.getByRole("listitem").filter({ hasText: "Search results" })).toBeVisible();
  });

  test("should handle search suggestions correctly", async ({ page }) => {
    // Test clicking on "Latest NDCs" suggestion
    await page.click('[data-cy="quick-search-1"]');

    // Should navigate to search page with the suggestion as query
    await page.waitForURL("/search*");
    const url = page.url();
    expect(url).toContain("c=UN-submissions");
    expect(url).toContain("t=Nationally+Determined+Contribution");
    expect(url).toContain("at=Party");
    expect(url).not.toContain("e=true");
    await expect(page.getByRole("listitem").filter({ hasText: "Search results" })).toBeVisible();

    // Navigate back to homepage for next test
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Verify clicking 'Indigenous people + Brazil + Laws' suggested search redirects to search page with correct parameters
    await page.click('[data-cy="quick-search-2"]');

    // Should navigate to search page with the suggestion as query
    await page.waitForURL("/search*");
    const url2 = page.url();
    expect(url2).toContain("c=laws");
    expect(url2).toContain("cfn=indigenous+people");
    expect(url2).toContain("l=brazil");
    expect(url2).not.toContain("e=true");
    await expect(page.getByRole("listitem").filter({ hasText: "Search results" })).toBeVisible();

    // Navigate back to homepage for next test
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Verify clicking 'Zoning and spatial planning + marine' suggested search redirects to search page with correct parameters
    await page.click('[data-cy="quick-search-3"]');

    // Should navigate to search page with the suggestion as query
    await page.waitForURL("/search*");
    const url3 = page.url();
    expect(url3).toContain("cfn=zoning+and+spatial+planning");
    expect(url3).toContain("q=marine");
    expect(url3).toContain("e=true");
    await expect(page.getByRole("listitem").filter({ hasText: "Search results" })).toBeVisible();

    // Navigate back to homepage for next test
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Verify clicking 'Emissions reductions targets + Climate framework laws' suggested search redirects to search page with correct parameters
    await page.click('[data-cy="quick-search-4"]');

    // Should navigate to search page with the suggestion as query
    await page.waitForURL("/search*");

    const url4 = page.url();
    expect(url4).toContain("c=laws");
    expect(url4).toContain("fl=true");
    expect(url4).not.toContain("e=true");
    await expect(page.getByRole("listitem").filter({ hasText: "Search results" })).toBeVisible();
  });

  test("should handle search with special characters", async ({ page }) => {
    const searchInput = page.locator('[data-cy="search-input"]');
    const searchButton = page.locator('button[aria-label="Search"]');

    // Test search with special characters
    const searchTerm = "climate & energy policy (2023)";
    await searchInput.fill(searchTerm);
    await searchButton.click();

    // Should navigate to search page with properly encoded search term
    await page.waitForURL("/search*");

    // Verify the search term is properly encoded in the URL using correct parameters
    const url = page.url();
    expect(url).toContain("q=climate+%26+energy+policy+%282023%29");
    expect(url).not.toContain("e=true");
  });

  test("should handle very long search terms", async ({ page }) => {
    const searchInput = page.locator('[data-cy="search-input"]');
    const searchButton = page.locator('button[aria-label="Search"]');

    // Test search with a very long term
    const longSearchTerm = "climate change adaptation and mitigation laws and policies for sustainable development in developing countries";
    await searchInput.fill(longSearchTerm);
    await searchButton.click();

    // Should navigate to search page without crashing
    await page.waitForURL("/search*");

    // Verify the search term is in the URL using correct parameters
    const url = page.url();
    expect(url).toContain("q=climate+change+adaptation+and+mitigation+laws+and+policies+for+sustainable+development+in+developing+countries");
    expect(url).not.toContain("e=true");
    await expect(page.getByRole("listitem").filter({ hasText: "Search results" })).toBeVisible();
  });

  test("should maintain search state on page refresh", async ({ page }) => {
    const searchTerm = "climate framework laws";

    // Type search term
    await page.fill('[data-cy="search-input"]', searchTerm);

    // Click search button
    await page.click('[data-cy="search-form"] button[aria-label="Search"]');

    // Should navigate to search results page
    await expect(page).toHaveURL(/\/search/);

    // Wait for the page to be fully loaded before refresh
    await page.waitForLoadState("networkidle");

    // Refresh the page with explicit wait
    await page.reload({ waitUntil: "networkidle" });

    // Should still be on search results page with same parameters
    await expect(page).toHaveURL(/\/search/);
    await expect(page).toHaveURL(/q=climate\+framework\+laws/);
    await expect(page).not.toHaveURL(/e=true/);
  });

  test("should not maintain search state on Home breadcrumb click", async ({ page }) => {
    const searchTerm = "adaptation";

    // Type search term
    await page.fill('[data-cy="search-input"]', searchTerm);

    // Click search button
    await page.click('[data-cy="search-form"] button[aria-label="Search"]');

    // Should navigate to search results page
    await expect(page).toHaveURL(/\/search/);

    // Navigate back to homepage via breadcrumb
    await page.click('[data-cy="breadcrumb home"] a');

    // Should now be on homepage with same parameters
    await expect(page.locator('[data-cy="cpr-logo"]')).toBeVisible();
    await expect(page).not.toHaveURL(/\/search/);
    await expect(page).not.toHaveURL(/q=adaptation/);
    await expect(page).not.toHaveURL(/e=true/);

    // Verify the search input is not cleared
    const searchInput = page.locator('[data-cy="search-input"]');
    await expect(searchInput).toHaveValue("");
    await expect(searchInput).not.toHaveValue(searchTerm);
  });

  test("should navigate to geography profile when clicking country suggestion", async ({ page }) => {
    const searchInput = page.locator('[data-cy="search-input"]');
    const searchForm = page.locator('[data-cy="search-form"]');

    // Click on the search form to trigger formFocus state
    await searchForm.click();

    // Type a country name
    await searchInput.fill("spain");

    // Click on Spain geography profile
    await page.getByRole("link", { name: "Spain Geography profile" }).click();

    // Should navigate to Spain geography page
    await page.waitForURL("/geographies/spain");

    // Verify we're on the geography page
    await expect(page.getByRole("heading", { name: "Spain" })).toBeVisible();
  });

  test("should handle 'Did you mean to search for X in Y?' search suggestion when typing country with additional terms", async ({ page }) => {
    const searchInput = page.locator('[data-cy="search-input"]');
    const searchForm = page.locator('[data-cy="search-form"]');

    // Click on the search form to trigger formFocus state
    await searchForm.click();

    await searchInput.fill("renewable energy france");

    // Verify "Did you mean" suggestion for France
    await expect(page.getByText("Did you mean to search for renewable energy in France")).toBeVisible();
    await expect(page.getByRole("link", { name: "France Geography profile" })).toBeVisible();

    // Test that clicking the suggestion navigates to search with correct parameters
    await page.getByText("Did you mean to search for").click();

    // Should navigate to search page with the suggestion parameters
    await page.waitForURL("/search*");

    // Verify the search term and country filter are applied
    const url = page.url();
    expect(url).toContain("q=renewable+energy");
    expect(url).toContain("l=france");
    expect(url).not.toContain("e=true");
    await expect(page.getByRole("listitem").filter({ hasText: "Search results" })).toBeVisible();
  });

  test("should handle search with multiple parameters", async ({ page }) => {
    const searchInput = page.locator('[data-cy="search-input"]');
    const searchButton = page.locator('button[aria-label="Search"]');

    // Type a search term that might trigger multiple filters
    const searchTerm = "renewable energy adaptation";
    await searchInput.fill(searchTerm);
    await searchButton.click();

    // Should navigate to search results page
    await expect(page).toHaveURL(/\/search/);

    // Should have correct query parameters
    await expect(page).toHaveURL(/q=renewable\+energy\+adaptation/);
    await expect(page).not.toHaveURL(/e=true/);
  });

  test("should handle search clear button", async ({ page }) => {
    const searchInput = page.locator('[data-cy="search-input"]');

    // Type a search term
    await searchInput.fill("test search");

    // Verify clear button is visible
    await expect(page.locator('[data-cy="search-clear-button"]')).toBeVisible();

    // Click clear button
    await page.click('[data-cy="search-clear-button"]');

    // Verify search input is cleared
    await expect(searchInput).toHaveValue("");

    // Verify clear button is no longer visible
    await expect(page.locator('[data-cy="search-clear-button"]')).not.toBeVisible();
  });

  test("should handle animated placeholder", async ({ page }) => {
    const searchInput = page.locator('[data-cy="search-input"]');

    // Verify animated placeholder is visible initially
    await expect(page.locator(".search-animated-placeholder")).toBeVisible();

    // Focus on search input
    await searchInput.focus();

    // Verify animated placeholder is hidden when focused
    await expect(page.locator(".search-animated-placeholder")).not.toBeVisible();

    // Blur the input
    await searchInput.blur();

    // Verify animated placeholder is visible again when empty
    await expect(page.locator(".search-animated-placeholder")).toBeVisible();
  });
});
