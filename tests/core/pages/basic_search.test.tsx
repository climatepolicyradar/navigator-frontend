import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import router from "next-router-mock";

import cprConfig from "@/cpr/config";
import { mockFeatureFlagsWithoutConcepts } from "@/mocks/featureFlags";
import { renderWithAppContext } from "@/mocks/renderWithAppContext";
import Search from "@/pages/search";

afterEach(() => {
  // clear router state between tests
  // we store query params in the router state so this resets everything
  router.reset();
});

const baseSearchProps = {
  envConfig: {
    BACKEND_API_URL: process.env.BACKEND_API_URL,
    CONCEPTS_API_URL: process.env.CONCEPTS_API_URL,
  },
  theme: "cpr",
  themeConfig: {
    ...cprConfig,
    features: { knowledgeGraph: false, searchFamilySummary: false },
  },
  featureFlags: mockFeatureFlagsWithoutConcepts,
  conceptsData: null,
  familyConceptsData: null,
};

describe("SearchPage", async () => {
  it("shows search onboarding info when no filters applied", async () => {
    const search_props = { ...baseSearchProps };
    // @ts-ignore
    renderWithAppContext(Search, search_props);

    expect(await screen.findByText("Get better results")).toBeInTheDocument();
    expect(screen.getByText(/You are currently viewing all of the documents in our database/)).toBeInTheDocument();
    expect(screen.queryByText(/Topics filter/)).not.toBeInTheDocument();
  });

  it("hides search onboarding info when filters are applied", async () => {
    const search_props = { ...baseSearchProps, searchParams: { q: "climate policy" } };
    router.query = { q: "climate policy" };
    // @ts-ignore
    renderWithAppContext(Search, search_props);

    expect(screen.queryByText(/Get better results/)).not.toBeInTheDocument();
    expect(screen.queryByText(/You are currently viewing all of the documents in our database/)).not.toBeInTheDocument();
  });

  it("handles search settings dropdown", async () => {
    const search_props = { ...baseSearchProps };
    // @ts-ignore
    renderWithAppContext(Search, search_props);

    const buttons = await screen.findAllByTestId("search-options");
    const searchOptionsButton = buttons[0]; // First button is the search options
    expect(searchOptionsButton).toBeInTheDocument();

    await act(async () => {
      await userEvent.click(searchOptionsButton);
    });

    // Expect length of 2: 1 in the search options and one as the selected option title
    expect(await screen.findAllByText(/Exact phrases/)).toHaveLength(2);

    // Expect length of only 1 as it'll only be in the search options and won't appear again as it isn't selected
    expect(await screen.findAllByText(/Related phrases/)).toHaveLength(1);
  });

  it("handles sort settings dropdown", async () => {
    const search_props = { ...baseSearchProps };
    // @ts-ignore
    renderWithAppContext(Search, search_props);

    const sortOptionsButtons = await screen.findAllByTestId("search-options");
    const sortOptionsButton = sortOptionsButtons[1]; // Second button is the sort options
    expect(sortOptionsButton).toBeInTheDocument();

    await act(async () => {
      await userEvent.click(sortOptionsButton);
    });

    // Expect length of 3 because we have 2 date options and 1 title option
    expect(await screen.findAllByText(/Date:/)).toHaveLength(3);

    // Expect length of 2 because we have 2 title options and Date is selected by default
    expect(await screen.findAllByText(/Title:/)).toHaveLength(2);
  });

  it("filters search results by region", async () => {
    // @ts-ignore
    renderWithAppContext(Search, baseSearchProps);

    expect(await screen.findByRole("heading", { level: 2, name: "Search results" })).toBeInTheDocument();

    // We have to wrap our user interactions in act() here due to some async updates that happen in the component,
    // like animations that were causing warnings in the console.
    await act(async () => {
      await userEvent.click(await screen.findByRole("button", { name: "Geography" }));
    });

    expect(await screen.findByText("Region")).toBeInTheDocument();

    const regionFilterOption = await screen.findByRole("checkbox", { name: "Latin America & Caribbean" });

    await act(async () => {
      await userEvent.click(regionFilterOption);
    });

    expect(regionFilterOption).toBeChecked();
    // check for applied filter button
    expect(screen.getByRole("button", { name: "Latin America & Caribbean" })).toBeInTheDocument();

    expect(await screen.findByText("Results")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Argentina Report" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Belize NDC" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Afghanistan report" })).not.toBeInTheDocument();
  });

  it("filters search results by country", async () => {
    // @ts-ignore
    renderWithAppContext(Search, baseSearchProps);

    expect(await screen.findByRole("heading", { level: 2, name: "Search results" })).toBeInTheDocument();

    // We have to wrap our user interactions in act() here due to some async updates that happen in the component,
    // like animations that were causing warnings in the console.
    await act(async () => {
      await userEvent.click(await screen.findByRole("button", { name: "Geography" }));
    });

    expect(await screen.findByText(/jurisdiction/i)).toBeInTheDocument();

    const countryOption = await screen.findByRole("checkbox", { name: "Belize" });

    await act(async () => {
      await userEvent.click(countryOption);
    });

    expect(countryOption).toBeChecked();
    // check for applied filter button
    expect(screen.getByRole("button", { name: "Belize" })).toBeInTheDocument();

    expect(await screen.findByText("Results")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Belize NDC" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Argentina Report" })).not.toBeInTheDocument();
  });
});
