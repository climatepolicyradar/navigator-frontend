import { act, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import router from "next-router-mock";

import { mockFeatureFlagsWithConcepts } from "@/mocks/featureFlags";
import { renderWithAppContext } from "@/mocks/renderWithAppContext";
import Search from "@/pages/search";

const baseSearchProps = {
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
  featureFlags: mockFeatureFlagsWithConcepts,
};

describe("SearchPage", async () => {
  it("shows search onboarding info when no filters applied", async () => {
    const search_props = { ...baseSearchProps };
    // @ts-ignore
    renderWithAppContext(Search, search_props);

    expect(await screen.findByText("Get better results")).toBeInTheDocument();
    expect(screen.getByText(/You are currently viewing all of the documents in our database/)).toBeInTheDocument();
    expect(screen.getByText(/Topics filter/)).toBeInTheDocument();
  });

  it("hides search onboarding info when filters are applied", async () => {
    const search_props = { ...baseSearchProps, searchParams: { q: "climate policy" } };
    router.query = { q: "climate policy" };
    // @ts-ignore
    renderWithAppContext(Search, search_props);

    expect(screen.queryByText(/Get better results/)).not.toBeInTheDocument();
    expect(screen.queryByText(/You are currently viewing all of the documents in our database/)).not.toBeInTheDocument();
  });

  it("filters search results by topic", async () => {
    const search_props = {
      ...baseSearchProps,
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

    const topicsFilterControl = await screen.findByRole("button", { name: /Topics/ });

    expect(topicsFilterControl).toBeInTheDocument();
    // We have to wrap our user interactions in act() here due to some async updates that happen in the component,
    // like animations that were causing warnings in the console.
    await act(async () => {
      await userEvent.click(topicsFilterControl);
    });

    expect(await screen.findByText(/Find mentions of topics/i));

    expect(screen.getByText(/Parent topic/)).toBeInTheDocument();
    const topic = screen.getByRole("checkbox", { name: "Child topic 1" });

    await act(async () => {
      await userEvent.click(topic);
    });

    expect(screen.getByRole("link", { name: "Family with topic 1" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Family with topic 2" })).not.toBeInTheDocument();
  });
});
