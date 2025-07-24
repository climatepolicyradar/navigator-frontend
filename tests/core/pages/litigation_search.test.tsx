import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import router from "next-router-mock";

import { createFeatureFlags } from "@/mocks/featureFlags";
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
    documentCategories: ["All"],
    features: { knowledgeGraph: false, searchFamilySummary: false, litigation: true },
    metadata: [
      {
        key: "search",
        title: "Law and Policy Search",
      },
    ],
  },
  featureFlags: createFeatureFlags({
    "concepts-v1": false,
    litigation: true,
  }),
  conceptsData: null,
  familyConceptsData: null,
};

describe("SearchPage", async () => {
  it("filters search results by subdivision", async () => {
    // @ts-ignore
    renderWithAppContext(Search, baseSearchProps);

    expect(await screen.findByRole("heading", { level: 2, name: "Search results" })).toBeInTheDocument();

    // We have to wrap our user interactions in act() here due to some async updates that happen in the component,
    // like animations that were causing warnings in the console.
    await act(async () => {
      await userEvent.click(await screen.findByRole("button", { name: "Geography" }));
    });

    expect(await screen.findByText("Subdivision")).toBeInTheDocument();

    const subdivisionOption = await screen.findByRole("checkbox", { name: "New South Wales" });

    await act(async () => {
      await userEvent.click(subdivisionOption);
    });

    expect(subdivisionOption).toBeChecked();
    // check for applied filter button
    expect(screen.getByRole("button", { name: "New South Wales" })).toBeInTheDocument();

    expect(await screen.findByText("Results")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "New South Wales Litigation Case" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Australia Litigation Case" })).not.toBeInTheDocument();
  });

  it("removes country and subdivision filters when a region filter is removed ", async () => {
    // @ts-ignore
    renderWithAppContext(Search, baseSearchProps);

    expect(await screen.findByRole("heading", { level: 2, name: "Search results" })).toBeInTheDocument();

    // We have to wrap our user interactions in act() here due to some async updates that happen in the component,
    // like animations that were causing warnings in the console.
    await act(async () => {
      await userEvent.click(await screen.findByRole("button", { name: "Geography" }));
    });

    expect(await screen.findByText("Region")).toBeInTheDocument();
    expect(await screen.findByText("Published jurisdiction")).toBeInTheDocument();
    expect(await screen.findByText("Subdivision")).toBeInTheDocument();

    const regionFilterOption = screen.getByRole("checkbox", { name: "East Asia & Pacific" });
    const countryFilterOption = screen.getByRole("checkbox", { name: "Australia" });
    const subdivisionFilterOption = screen.getByRole("checkbox", { name: "New South Wales" });

    await act(async () => {
      await userEvent.click(regionFilterOption);
      await userEvent.click(countryFilterOption);
      await userEvent.click(subdivisionFilterOption);
    });

    const appliedRegionFilter = screen.getByRole("button", { name: "East Asia & Pacific" });
    const appliedCountryFilter = screen.getByRole("button", { name: "Australia" });
    const appliedSubdivisionFilter = screen.getByRole("button", { name: "New South Wales" });

    // uncheck filter for region
    await act(async () => {
      await userEvent.click(regionFilterOption);
    });

    expect(regionFilterOption).not.toBeChecked();
    expect(countryFilterOption).not.toBeChecked();
    expect(subdivisionFilterOption).not.toBeChecked();

    expect(appliedRegionFilter).not.toBeInTheDocument();
    expect(appliedCountryFilter).not.toBeInTheDocument();
    expect(appliedSubdivisionFilter).not.toBeInTheDocument();
  });

  it("removes subdivision filters when a country filter is removed", async () => {
    // @ts-ignore
    renderWithAppContext(Search, baseSearchProps);

    expect(await screen.findByRole("heading", { level: 2, name: "Search results" })).toBeInTheDocument();

    // We have to wrap our user interactions in act() here due to some async updates that happen in the component,
    // like animations that were causing warnings in the console.
    await act(async () => {
      await userEvent.click(await screen.findByRole("button", { name: "Geography" }));
    });

    expect(await screen.findByText("Published jurisdiction")).toBeInTheDocument();
    await act(async () => {
      await userEvent.click(await screen.findByRole("checkbox", { name: "Australia" }));
    });

    expect(await screen.findByText("Subdivision")).toBeInTheDocument();
    await act(async () => {
      await userEvent.click(await screen.findByRole("checkbox", { name: "New South Wales" }));
    });

    const countryFilter = screen.getByRole("button", { name: "Australia" });
    const subdivisionFilter = screen.getByRole("button", { name: "New South Wales" });

    // remove applied filter for country
    await act(async () => {
      await userEvent.click(countryFilter);
    });

    expect(countryFilter).not.toBeInTheDocument();
    expect(subdivisionFilter).not.toBeInTheDocument();
  });
});
