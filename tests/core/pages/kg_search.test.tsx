import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import router from "next-router-mock";

import cprConfig from "@/cpr/config";
import { mockFeatureFlagsWithConcepts } from "@/mocks/featureFlags";
import { resetPage } from "@/mocks/helpers";
import { renderWithAppContext } from "@/mocks/renderWithAppContext";
import Search from "@/pages/search";

afterEach(() => {
  resetPage();
});

const baseSearchProps = {
  envConfig: {
    BACKEND_API_URL: process.env.BACKEND_API_URL,
    CONCEPTS_API_URL: process.env.CONCEPTS_API_URL,
  },
  theme: "cpr",
  themeConfig: cprConfig,
  featureFlags: mockFeatureFlagsWithConcepts,
};

describe("SearchPage", async () => {
  it("shows search onboarding info when no filters applied", async () => {
    const search_props = { ...baseSearchProps };
    // @ts-ignore
    renderWithAppContext(Search, search_props);

    // Wait for the component to render
    await waitFor(() => {
      expect(screen.getByText("Get better results")).toBeInTheDocument();
    });

    expect(await screen.findByText(/You are currently viewing all of the documents in our database/i)).toBeInTheDocument();
    expect(await screen.findByText(/Topics filter/i)).toBeInTheDocument();
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
    // @ts-ignore
    renderWithAppContext(Search, {
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
    });

    await userEvent.click(await screen.findByRole("button", { name: "Topics Beta" }));

    expect(await screen.findByText("Find mentions of topics")).toBeInTheDocument();
    expect(screen.getByText("Parent topic")).toBeInTheDocument();

    const topicOption = screen.getByRole("checkbox", { name: "Child topic 1" });

    await userEvent.click(topicOption);

    expect(topicOption).toBeChecked();
    // check for applied filter button and in the info box
    expect(screen.getAllByRole("button", { name: "Child topic 1" })).toHaveLength(2);

    expect(screen.getByRole("link", { name: "Family with topic 1" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Family with topic 2" })).not.toBeInTheDocument();
  });
});
