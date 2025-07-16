import { act, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import router from "next-router-mock";

import { renderWithAppContext } from "@/mocks/renderWithAppContext";
import Search from "@/pages/search";

afterEach(() => {
  // clear router state between tests
  // we store query params in the router state so this resets everything
  router.reset();
});

describe("SearchPage", async () => {
  it("filters search results by region", async () => {
    const search_props = {
      envConfig: {
        BACKEND_API_URL: process.env.BACKEND_API_URL,
        CONCEPTS_API_URL: process.env.CONCEPTS_API_URL,
      },
      theme: "cpr",
      themeConfig: {
        documentCategories: ["All"],
        features: { knowledgeGraph: false, searchFamilySummary: false },
        metadata: [
          {
            key: "search",
            title: "Law and Policy Search",
          },
        ],
      },
    };
    // @ts-ignore
    renderWithAppContext(Search, search_props);

    expect(await screen.findByRole("heading", { level: 2, name: "Search results" })).toBeInTheDocument();

    const geographyFilterControl = await screen.findByText("Geography");

    expect(geographyFilterControl).toBeInTheDocument();
    // We have to wrap our user interactions in act() here due to some async updates that happen in the component,
    // like animations that were causing warnings in the console.
    await act(async () => {
      await userEvent.click(geographyFilterControl);
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
    const search_props = {
      envConfig: {
        BACKEND_API_URL: process.env.BACKEND_API_URL,
        CONCEPTS_API_URL: process.env.CONCEPTS_API_URL,
      },
      theme: "cpr",
      themeConfig: {
        documentCategories: ["All"],
        features: { knowledgeGraph: false, searchFamilySummary: false },
        metadata: [
          {
            key: "search",
            title: "Law and Policy Search",
          },
        ],
      },
    };
    // @ts-ignore
    renderWithAppContext(Search, search_props);

    expect(await screen.findByRole("heading", { level: 2, name: "Search results" })).toBeInTheDocument();

    const geographyFilterControl = await screen.findByRole("button", { name: "Geography" });

    expect(geographyFilterControl).toBeInTheDocument();
    // We have to wrap our user interactions in act() here due to some async updates that happen in the component,
    // like animations that were causing warnings in the console.
    await act(async () => {
      await userEvent.click(geographyFilterControl);
    });

    expect(await screen.findByText("Published jurisdiction")).toBeInTheDocument();

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

  it("filters search results by subdivision", async () => {
    const search_props = {
      envConfig: {
        BACKEND_API_URL: process.env.BACKEND_API_URL,
        CONCEPTS_API_URL: process.env.CONCEPTS_API_URL,
      },
      theme: "cpr",
      themeConfig: {
        documentCategories: ["All"],
        features: { knowledgeGraph: false, searchFamilySummary: false },
        metadata: [
          {
            key: "search",
            title: "Law and Policy Search",
          },
        ],
      },
    };
    // @ts-ignore
    renderWithAppContext(Search, search_props);

    expect(await screen.findByRole("heading", { level: 2, name: "Search results" })).toBeInTheDocument();

    const geographyFilterControl = await screen.findByRole("button", { name: "Geography" });

    expect(geographyFilterControl).toBeInTheDocument();
    // We have to wrap our user interactions in act() here due to some async updates that happen in the component,
    // like animations that were causing warnings in the console.
    await act(async () => {
      await userEvent.click(geographyFilterControl);
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

  it("filters search results by topic", async () => {
    const search_props = {
      envConfig: {
        BACKEND_API_URL: process.env.BACKEND_API_URL,
        CONCEPTS_API_URL: process.env.CONCEPTS_API_URL,
      },
      theme: "cpr",
      themeConfig: {
        documentCategories: ["All"],
        features: { knowledgeGraph: true, searchFamilySummary: false },
        metadata: [
          {
            key: "search",
            title: "Law and Policy Search",
          },
        ],
      },
      conceptsData: [
        {
          alternative_labels: [],
          description: "test concept 1",
          has_subconcept: [],
          negative_labels: [],
          preferred_label: "child topic 1",
          recursive_subconcept_of: [],
          related_concepts: [],
          subconcept_of: [],
          wikibase_id: "1",
        },
      ],
    };
    // @ts-ignore
    renderWithAppContext(Search, search_props);

    expect(await screen.findByRole("heading", { level: 2, name: "Search results" })).toBeInTheDocument();

    const topicsFilterControl = await screen.findByText("Topics");

    expect(topicsFilterControl).toBeInTheDocument();
    // We have to wrap our user interactions in act() here due to some async updates that happen in the component,
    // like animations that were causing warnings in the console.
    await act(async () => {
      await userEvent.click(topicsFilterControl);
    });

    expect(await screen.findByText("Find mentions of topics")).toBeInTheDocument();
    expect(screen.getByText("Parent topic")).toBeInTheDocument();

    const topicOption = screen.getByRole("checkbox", { name: "Child topic 1" });

    await act(async () => {
      await userEvent.click(topicOption);
    });

    expect(topicOption).toBeChecked();
    // check for applied filter button
    expect(screen.getByRole("button", { name: "Child topic 1" }));

    expect(screen.getByRole("link", { name: "Family with topic 1" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Family with topic 2" })).not.toBeInTheDocument();
  });
});
