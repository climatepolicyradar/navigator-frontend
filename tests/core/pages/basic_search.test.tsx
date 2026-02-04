import { fireEvent, screen } from "@testing-library/react";
import router from "next-router-mock";

import { DEFAULT_FEATURES } from "@/constants/features";
import { sortOptions, sortOptionsBrowse } from "@/constants/sortOptions";
import cprConfig from "@/cpr/config";
import { resetPage } from "@/mocks/helpers";
import { renderWithAppContext } from "@/mocks/renderWithAppContext";
import Search, { type TProps as TSearchPageProps } from "@/pages/search";

afterEach(() => {
  resetPage();
});

const baseSearchProps: TSearchPageProps = {
  envConfig: {
    BACKEND_API_URL: "",
    BACKEND_API_TOKEN: "",
    TARGETS_URL: "",
    CDN_URL: "",
    CONCEPTS_API_URL: "",
    ADOBE_API_KEY: "",
    REDIRECT_FILE: "",
    HOSTNAME: "",
  },
  familyConceptsData: null,
  features: DEFAULT_FEATURES,
  theme: "cpr",
  themeConfig: {
    ...cprConfig,
  },
  topicsData: { rootTopics: [], topics: [] },
};

describe("SearchPage", async () => {
  it("shows search onboarding info when no filters applied", async () => {
    const search_props = { ...baseSearchProps };

    renderWithAppContext(Search, { pageProps: search_props });

    expect(screen.getByText(/You are currently viewing all of the documents/)).toBeInTheDocument();

    expect(screen.queryByText(/Topics filter/)).not.toBeInTheDocument();
  });

  it("hides search onboarding info when filters are applied", async () => {
    const search_props = { ...baseSearchProps, searchParams: { q: "climate policy" } };
    router.query = { q: "climate policy" };

    renderWithAppContext(Search, { pageProps: search_props });

    expect(screen.queryByText(/Get better results/)).not.toBeInTheDocument();
    expect(screen.queryByText(/You are currently viewing all of the documents in our database/)).not.toBeInTheDocument();
  });

  it("displays search settings options when clicked on", async () => {
    const search_props = { ...baseSearchProps };

    renderWithAppContext(Search, { pageProps: search_props });

    const searchOptionsButton = await screen.findByRole("button", { name: "Search options" });
    expect(searchOptionsButton).toHaveTextContent("Exact phrases");

    fireEvent.click(searchOptionsButton);

    // Check there are two options in the list
    expect(await screen.findByRole("list", { name: "Semantic search" })).toBeInTheDocument();
    expect(await screen.findByRole("button", { name: "Exact match" })).toBeInTheDocument();
    expect(await screen.findByRole("button", { name: "Related phrases" })).toBeInTheDocument();

    // Select one
    const relatedPhrasesOption = await screen.findByRole("button", { name: "Related phrases" });
    fireEvent.click(relatedPhrasesOption);

    // Check that the search options has been updated to reflect the selected option
    expect(await screen.findByRole("button", { name: "Search options" })).toHaveTextContent("Related phrases");
  });

  it("displays sort settings options when clicked on", async () => {
    const search_props = { ...baseSearchProps };

    renderWithAppContext(Search, { pageProps: search_props });

    const searchOptionsButton = await screen.findByRole("button", { name: "Sort options" });
    expect(searchOptionsButton).toBeInTheDocument();

    fireEvent.click(searchOptionsButton);

    // Check there are the correct options in the list - browse by default
    for (const item of sortOptionsBrowse) {
      expect(await screen.findByRole("button", { name: item.label })).toBeInTheDocument();
    }

    // Select one
    const sortOptionToSelect = await screen.findByRole("button", { name: sortOptionsBrowse[0].label });
    fireEvent.click(sortOptionToSelect);

    // Check that the search options has been updated to reflect the selected option
    expect(await screen.findByRole("button", { name: "Sort options" })).toHaveTextContent(sortOptionsBrowse[0].label);
  });

  it("display the non-browse sort settings when there is a search term", async () => {
    const search_props = { ...baseSearchProps, searchParams: { q: "climate policy" } };
    router.query = { q: "climate policy" };

    renderWithAppContext(Search, { pageProps: search_props });

    const searchOptionsButton = await screen.findByRole("button", { name: "Sort options" });
    expect(searchOptionsButton).toBeInTheDocument();

    fireEvent.click(searchOptionsButton);

    for (const item of sortOptions) {
      expect(await screen.findByRole("button", { name: item.label })).toBeInTheDocument();
    }
  });

  it("filters search results by region", async () => {
    renderWithAppContext(Search, { pageProps: baseSearchProps });

    // Verify slideout is initially closed.
    expect(screen.queryByText("Region")).not.toBeInTheDocument();

    fireEvent.click(await screen.findByRole("button", { name: "Geography" }));

    // Verify the slideout is now open.
    expect(await screen.findByText("Region")).toBeInTheDocument();

    const regionFilterOption = await screen.findByRole("checkbox", { name: "Latin America & Caribbean" });

    fireEvent.click(regionFilterOption);

    expect(regionFilterOption).toBeChecked();

    // Verify the applied filter for the selected region is visible.
    expect(screen.getByRole("button", { name: "Latin America & Caribbean" })).toBeInTheDocument();

    // Verify the results are filtered by the region.
    expect(await screen.findByText("Results:")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Argentina Report" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Belize NDC" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Afghanistan report" })).not.toBeInTheDocument();
  });

  it("filters search results by country", async () => {
    renderWithAppContext(Search, { pageProps: baseSearchProps });

    // Verify slideout is initially closed.
    expect(screen.queryByText("Published jurisdiction")).not.toBeInTheDocument();

    fireEvent.click(await screen.findByRole("button", { name: "Geography" }));

    // Verify the slideout is now open.
    expect(await screen.findByText("Published jurisdiction")).toBeInTheDocument();

    // Find the country option and click it.
    const countryOption = await screen.findByRole("checkbox", { name: "Belize" });

    fireEvent.click(countryOption);

    expect(countryOption).toBeChecked();

    // Verify the applied filter for the selected country is visible.
    expect(screen.getByRole("button", { name: "Belize" })).toBeInTheDocument();

    // Verify the results are filtered by the country.
    expect(await screen.findByText("Results:")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Belize NDC" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Argentina Report" })).not.toBeInTheDocument();
  });
});
