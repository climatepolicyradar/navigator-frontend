import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import router from "next-router-mock";

import { DEFAULT_FEATURES } from "@/constants/features";
import cprConfig from "@/cpr/config";
import { resetPage } from "@/mocks/helpers";
import { renderWithAppContext } from "@/mocks/renderWithAppContext";
import Search from "@/pages/search";

afterEach(() => {
  resetPage();
});

const baseSearchProps: any = {
  conceptsData: null,
  // TODO: fix 'any' type
  envConfig: {
    BACKEND_API_URL: process.env.BACKEND_API_URL,
    CONCEPTS_API_URL: process.env.CONCEPTS_API_URL,
  },
  familyConceptsData: null,
  features: DEFAULT_FEATURES,
  theme: "cpr",
  themeConfig: {
    ...cprConfig,
    features: { knowledgeGraph: false, searchFamilySummary: false },
  },
  topicsData: { rootTopics: [], topics: [] },
};

describe("SearchPage", async () => {
  it("shows search onboarding info when no filters applied", async () => {
    const search_props = { ...baseSearchProps };

    renderWithAppContext(Search, { pageProps: search_props });

    // Wait for the component to render
    await waitFor(() => {
      expect(screen.getByText("Get better results")).toBeInTheDocument();
    });

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

    await userEvent.click(searchOptionsButton);

    // Check there are two options in the list
    // screen.debug(screen.getByRole("list", { name: "Semantic search" }));
    expect(await screen.findByRole("list", { name: "Semantic search" })).toBeInTheDocument();

    // Select one

    // Check that it is the selected item

    // Expect length of 2: 1 in the search options and one as the selected option title
    // expect(await screen.findAllByText(/Exact phrases/i)).toHaveLength(2);

    // // Expect length of only 1 as it'll only be in the search options and won't appear again as it isn't selected
    // expect(await screen.findAllByText(/Related phrases/)).toHaveLength(1);
  });

  it("displays sort settings options when clicked on", async () => {
    const search_props = { ...baseSearchProps };

    renderWithAppContext(Search, { pageProps: search_props });

    const searchOptionsButton = await screen.findByRole("button", { name: "Sort options" });
    expect(searchOptionsButton).toBeInTheDocument();

    await userEvent.click(searchOptionsButton);

    // Expect length of 3 because we have 2 date options and 1 title option
    expect(await screen.findAllByText(/Date:/)).toHaveLength(3);

    // Expect length of 2 because we have 2 title options and Date is selected by default
    expect(await screen.findAllByText(/Title:/)).toHaveLength(2);
  });

  it("filters search results by region", async () => {
    renderWithAppContext(Search, { pageProps: baseSearchProps });

    // Verify slideout is initially closed.
    expect(screen.queryByText("Region")).not.toBeInTheDocument();

    await userEvent.click(await screen.findByRole("button", { name: "Geography" }));

    // Verify the slideout is now open.
    expect(await screen.findByText("Region")).toBeInTheDocument();

    const regionFilterOption = await screen.findByRole("checkbox", { name: "Latin America & Caribbean" });

    await userEvent.click(regionFilterOption);

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

    await userEvent.click(await screen.findByRole("button", { name: "Geography" }));

    // Verify the slideout is now open.
    expect(await screen.findByText("Published jurisdiction")).toBeInTheDocument();

    // Find the country option and click it.
    const countryOption = await screen.findByRole("checkbox", { name: "Belize" });

    await userEvent.click(countryOption);

    expect(countryOption).toBeChecked();

    // Verify the applied filter for the selected country is visible.
    expect(screen.getByRole("button", { name: "Belize" })).toBeInTheDocument();

    // Verify the results are filtered by the country.
    expect(await screen.findByText("Results:")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Belize NDC" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Argentina Report" })).not.toBeInTheDocument();
  });
});
