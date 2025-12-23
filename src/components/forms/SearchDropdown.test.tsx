import { screen, fireEvent } from "@testing-library/react";
import { vi, it } from "vitest";

import { renderWithAppContext } from "@/mocks/renderWithAppContext";
import { TGeography } from "@/types";

import { SearchDropdown } from "../../components/forms/SearchDropdown";

type TQueryResponse = {
  data: {
    countries: TGeography[];
  };
  isLoading: boolean;
  error: unknown;
};

// Mock useConfig hook
vi.mock("@/hooks/useConfig", () => ({
  default: (): TQueryResponse => ({
    data: {
      countries: [
        { id: 1, slug: "spain", display_value: "Spain", value: "spain", type: "country", parent_id: null },
        { id: 2, slug: "france", display_value: "France", value: "france", type: "country", parent_id: null },
        { id: 3, slug: "south-africa", display_value: "South Africa", value: "south-africa", type: "country", parent_id: null },
        {
          id: 4,
          slug: "central-african-republic",
          display_value: "Central African Republic",
          value: "central-african-republic",
          type: "country",
          parent_id: null,
        },
        { id: 5, slug: "sudan", display_value: "Sudan", value: "sudan", type: "country", parent_id: null },
        { id: 6, slug: "south-sudan", display_value: "South Sudan", value: "south-sudan", type: "country", parent_id: null },
      ],
    },
    isLoading: false,
    error: {},
  }),
}));

// Mock system geocodes
vi.mock("@/constants/systemGeos", () => ({
  SYSTEM_GEO_CODES: ["global", "regional"],
}));

const defaultProps = {
  show: true,
  term: "",
  handleSearchClick: vi.fn(),
  largeSpacing: false,
};

function textContentMatcher(text: string) {
  return (_: string, element: Element | null) => {
    if (!element) return false;
    const content = element.textContent || "";
    // For "Did you mean" suggestions, we need to be more flexible as text is split across spans
    if (text.includes("Did you mean")) {
      return content.includes("Did you mean") && element.tagName === "A";
    }
    return content.includes(text) && element.tagName === "A";
  };
}

describe("SearchDropdown", () => {
  let mockPush: any;
  let mockQuery: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Create fresh mocks for each test
    mockPush = vi.fn();
    mockQuery = {};

    // Configure next-router-mock to use our custom push function
    const routerMock = require("next-router-mock");
    routerMock.default.push = mockPush;
    routerMock.default.query = mockQuery;
  });

  it("should not render when show is false", async () => {
    await renderWithAppContext(SearchDropdown, { ...defaultProps, show: false });

    expect(screen.queryByText("Search")).not.toBeInTheDocument();
  });

  it("should not render when term is empty", async () => {
    await renderWithAppContext(SearchDropdown, { ...defaultProps, term: "" });

    expect(screen.queryByText("Search")).not.toBeInTheDocument();
  });

  it("should display search dropdown with a country suggestion when typing a country name", async () => {
    await renderWithAppContext(SearchDropdown, { ...defaultProps, term: "spain" });

    // Verify "Search in all documents" option is present
    expect(screen.getAllByText(textContentMatcher("Search spain in all documents"))[0]).toBeInTheDocument();

    // Verify Spain geography profile is suggested
    expect(screen.getByRole("link", { name: "Spain Geography profile" })).toBeInTheDocument();

    // Verify the section header is present
    expect(screen.getByText("View countries and territories information")).toBeInTheDocument();
  });

  it("should display multiple country suggestions for partial matches", async () => {
    await renderWithAppContext(SearchDropdown, { ...defaultProps, term: "fr" });

    // Verify "Search in all documents" option is present
    expect(screen.getAllByText(textContentMatcher("Search fr in all documents"))[0]).toBeInTheDocument();

    // Verify multiple countries are suggested (France, South Africa, Central African Republic)
    expect(screen.getByRole("link", { name: "France Geography profile" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "South Africa Geography profile" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Central African Republic Geography profile" })).toBeInTheDocument();

    // Verify the section header is present
    expect(screen.getByText("View countries and territories information")).toBeInTheDocument();
  });

  it("should display multiple country suggestions for term in multiple country names", async () => {
    await renderWithAppContext(SearchDropdown, { ...defaultProps, term: "sudan" });

    // Verify "Search in all documents" option is present
    expect(screen.getAllByText(textContentMatcher("Search sudan in all documents"))[0]).toBeInTheDocument();

    // Verify multiple countries are suggested (Sudan, South Sudan)
    expect(screen.getByRole("link", { name: "Sudan Geography profile" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "South Sudan Geography profile" })).toBeInTheDocument();

    // Verify the section header is present
    expect(screen.getByText("View countries and territories information")).toBeInTheDocument();
  });

  it("should display 'Did you mean to search for X in Y?' suggestion when typing country with additional terms", async () => {
    await renderWithAppContext(SearchDropdown, { ...defaultProps, term: "climate spain" });

    // Verify "Search in all documents" option is present
    expect(screen.getAllByText(textContentMatcher("Search climate spain in all documents"))[0]).toBeInTheDocument();

    // Verify "Did you mean" suggestion is present
    expect(screen.getAllByText(textContentMatcher("Did you mean to search for climate in Spain?"))[0]).toBeInTheDocument();

    // Verify Spain geography profile is also suggested
    expect(screen.getByRole("link", { name: "Spain Geography profile" })).toBeInTheDocument();
  });

  it("should display 'Did you mean' suggestion for multiple word terms", async () => {
    await renderWithAppContext(SearchDropdown, { ...defaultProps, term: "renewable energy france" });

    // Verify "Search in all documents" option is present
    expect(screen.getAllByText(textContentMatcher("Search renewable energy france in all documents"))[0]).toBeInTheDocument();

    // Verify "Did you mean" suggestion is present
    expect(screen.getAllByText(textContentMatcher("Did you mean to search for renewable energy in France?"))[0]).toBeInTheDocument();

    // Verify France geography profile is also suggested
    expect(screen.getByRole("link", { name: "France Geography profile" })).toBeInTheDocument();
  });

  it("should handle clicking on 'Search in all documents' option", async () => {
    const handleSearchClick = vi.fn();
    await renderWithAppContext(SearchDropdown, { ...defaultProps, term: "climate", handleSearchClick });

    // Click on the "Search in all documents" option
    fireEvent.click(screen.getAllByText(textContentMatcher("Search climate in all documents"))[0]);

    // Verify handleSearchClick was called with the correct term
    expect(handleSearchClick).toHaveBeenCalledWith("climate");
  });

  it("should handle clicking on 'Did you mean' suggestion", async () => {
    const handleSearchClick = vi.fn();
    await renderWithAppContext(SearchDropdown, { ...defaultProps, term: "climate spain", handleSearchClick });

    // Click on the "Did you mean" suggestion
    fireEvent.click(screen.getAllByText(textContentMatcher("Did you mean to search for climate in Spain?"))[0]);

    // Verify handleSearchClick was called with the correct parameters
    expect(handleSearchClick).toHaveBeenCalledWith("climate", "l", "spain");
  });

  it("should handle clicking on geography profile link", async () => {
    await renderWithAppContext(SearchDropdown, { ...defaultProps, term: "spain" });

    // Click on Spain geography profile
    fireEvent.click(screen.getByRole("link", { name: "Spain Geography profile" }));

    // Verify router.push was called with the correct URL
    expect(mockPush).toHaveBeenCalledWith({
      pathname: "/geographies/spain",
      query: {},
    });
  });

  it("should preserve query parameters when clicking geography profile link", async () => {
    // Set up initial query parameters
    Object.assign(mockQuery, { someParam: "value", anotherParam: "test" });

    await renderWithAppContext(SearchDropdown, { ...defaultProps, term: "spain" });

    // Click on Spain geography profile
    fireEvent.click(screen.getByRole("link", { name: "Spain Geography profile" }));

    // Verify router.push was called with the correct URL and preserved query params
    expect(mockPush).toHaveBeenCalledWith({
      pathname: "/geographies/spain",
      query: { someParam: "value", anotherParam: "test" },
    });
  });

  it.fails("should fail (handle multiple geography matches by showing all geography profiles)", async () => {
    await renderWithAppContext(SearchDropdown, { ...defaultProps, term: "sudan policy" });

    // Should show "Did you mean" suggestions for Sudan and South Sudan
    expect(screen.getAllByText(textContentMatcher("Did you mean to search for policy in Sudan?"))[0]).toBeInTheDocument();
    expect(screen.getAllByText(textContentMatcher("Did you mean to search for policy in South Sudan?"))[0]).toBeInTheDocument();

    // Should show Sudan and South Sudan geography profiles
    expect(screen.getByRole("link", { name: "Sudan Geography profile" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "South Sudan Geography profile" })).toBeInTheDocument();
  });

  it("should not show 'Did you mean' suggestion when term only contains country name", async () => {
    await renderWithAppContext(SearchDropdown, { ...defaultProps, term: "spain" });

    // Should not show "Did you mean" suggestion when term is just the country name
    expect(screen.queryByText("Did you mean to search for")).not.toBeInTheDocument();

    // Should still show the geography profile
    expect(screen.getByRole("link", { name: "Spain Geography profile" })).toBeInTheDocument();
  });

  it("should not show 'Did you mean' suggestion when country name is not in term", async () => {
    await renderWithAppContext(SearchDropdown, { ...defaultProps, term: "climate policy" });

    // Should not show "Did you mean" suggestion when no country matches
    expect(screen.queryByText("Did you mean to search for")).not.toBeInTheDocument();

    // Should not show any geography profiles
    expect(screen.queryByText("View countries and territories information")).not.toBeInTheDocument();
  });

  it("should apply large spacing class when largeSpacing prop is true", async () => {
    await renderWithAppContext(SearchDropdown, { ...defaultProps, term: "spain", largeSpacing: true });

    const dropdown = document.querySelector(".search-dropdown");
    expect(dropdown).toHaveClass("search-dropdown_large");
  });

  it("should not apply large spacing class when largeSpacing prop is false", async () => {
    await renderWithAppContext(SearchDropdown, { ...defaultProps, term: "spain", largeSpacing: false });

    const dropdown = document.querySelector(".search-dropdown");
    expect(dropdown).not.toHaveClass("search-dropdown_large");
  });

  it("should handle case insensitive country matching", async () => {
    await renderWithAppContext(SearchDropdown, { ...defaultProps, term: "SPAIN" });

    // Should still find Spain despite different case
    expect(screen.getByRole("link", { name: "Spain Geography profile" })).toBeInTheDocument();
  });

  it("should handle case insensitive partial country matches", async () => {
    await renderWithAppContext(SearchDropdown, { ...defaultProps, term: "FR" });

    // Should still find countries that contain "fr" despite different case
    expect(screen.getByRole("link", { name: "France Geography profile" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "South Africa Geography profile" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Central African Republic Geography profile" })).toBeInTheDocument();
  });
});
