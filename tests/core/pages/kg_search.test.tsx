import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import router from "next-router-mock";

import { DEFAULT_FEATURES } from "@/constants/features";
import cprConfig from "@/cpr/config";
import { resetPage } from "@/mocks/helpers";
import { renderWithAppContext } from "@/mocks/renderWithAppContext";
import Search from "@/pages/search";
import { TTopics } from "@/types";

afterEach(() => {
  resetPage();
});

const baseSearchProps = {
  envConfig: {
    BACKEND_API_URL: process.env.BACKEND_API_URL,
    CONCEPTS_API_URL: process.env.CONCEPTS_API_URL,
  },
  features: {
    ...DEFAULT_FEATURES,
    knowledgeGraph: true,
  },
  theme: "cpr",
  themeConfig: cprConfig,
  topicsData: { rootTopics: [], topics: [] } as TTopics,
};

describe("SearchPage", async () => {
  it("shows search onboarding info when no filters applied", async () => {
    const search_props = { ...baseSearchProps };
    // @ts-ignore
    renderWithAppContext(Search, { pageProps: search_props });

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
    renderWithAppContext(Search, { pageProps: search_props });

    expect(screen.queryByText(/Get better results/)).not.toBeInTheDocument();
    expect(screen.queryByText(/You are currently viewing all of the documents in our database/)).not.toBeInTheDocument();
  });

  it("filters search results by topic", async () => {
    // @ts-ignore
    renderWithAppContext(Search, {
      pageProps: {
        ...baseSearchProps,
        topicsData: {
          rootTopics: [
            {
              alternative_labels: [],
              definition: "",
              description: "",
              has_subconcept: ["Q1652"],
              labelled_passages: [],
              negative_labels: [],
              preferred_label: "target",
              recursive_subconcept_of: [],
              related_concepts: ["Q1171"],
              subconcept_of: [],
              wikibase_id: "Q1651",
            },
          ],
          topics: [
            {
              alternative_labels: [],
              definition: "",
              description: "",
              has_subconcept: [],
              labelled_passages: [],
              negative_labels: [],
              preferred_label: "child topic 1",
              recursive_subconcept_of: ["Q1651", "Q1652"],
              related_concepts: [],
              subconcept_of: ["Q1652"],
              wikibase_id: "1",
            },
          ],
        },
      },
    });

    await userEvent.click(await screen.findByRole("button", { name: "Topics Beta" }));

    expect(await screen.findByText("Find mentions of topics")).toBeInTheDocument();
    expect(screen.getByText("Target")).toBeInTheDocument();

    const topicOption = screen.getByRole("checkbox", { name: "Child topic 1" });

    await userEvent.click(topicOption);

    expect(topicOption).toBeChecked();
    // check for applied filter button and in the info box
    expect(screen.getAllByRole("button", { name: "Child topic 1" })).toHaveLength(2);

    expect(screen.getByRole("link", { name: "Family with topic 1" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Family with topic 2" })).not.toBeInTheDocument();
  });
});
