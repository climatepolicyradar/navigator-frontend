import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockRouter from "next-router-mock";
import * as nextRouterMock from "next-router-mock";

import { IFamilyDocumentTopics, ISearchPassage, TFamilyPublic, TTopic } from "@/types";

import { FamilyPassageViewer } from "./FamilyPassageViewer";

vi.mock("next/router", () => nextRouterMock);

const mockFetchSearchPassages = vi.hoisted(() => vi.fn());
vi.mock("@/api/passages", () => ({ fetchSearchPassages: mockFetchSearchPassages }));

// A stateful stand-in for the URL params, keyed by parameter name. nuqs' own testing
// adapter is fully controlled and reverts the value after every write, which the component
// reads as a browser navigation. The real adapter (wired in _app.tsx) keeps the value, so
// this fake reproduces production semantics: read the initial value, then hold what is written.
const urlQuery = vi.hoisted(() => ({ initial: {} as Record<string, unknown>, writes: [] as { key: string; value: unknown }[] }));
vi.mock("nuqs", async (importOriginal) => {
  const actual = await importOriginal<typeof import("nuqs")>();
  const { useState } = await import("react");
  return {
    ...actual,
    useQueryState: (key: string, parser: { defaultValue?: unknown }) => {
      const [value, setValue] = useState(() => urlQuery.initial[key] ?? parser?.defaultValue);
      return [
        value,
        (next: unknown) => {
          urlQuery.writes.push({ key, value: next });
          setValue(next ?? parser?.defaultValue);
          return Promise.resolve(new URLSearchParams());
        },
      ];
    },
  };
});

const buildPassage = (overrides: Partial<ISearchPassage> = {}): ISearchPassage => ({
  id: "passage-1",
  text_block_id: "block-1",
  idx: 12,
  text: "Certain ecological and other requirements for the areas used by cultivation.",
  labels: [],
  language: "en",
  type: "",
  type_confidence: 0,
  page_number: 0,
  pages: [16],
  pages_with_bounding_boxes: [],
  concepts: [],
  heading_id: "heading-1",
  heading_text: "Section 4: National Target 16",
  document_id: "CCLW.document.1.1",
  principal_id: "CCLW.family.1.0",
  tokens: [],
  ...overrides,
});

const family = {
  import_id: "CCLW.family.1.0",
  slug: "a-family",
  title: "Inflation reduction act",
  documents: [
    { import_id: "CCLW.document.1.1", slug: "main-document", title: "Law for the expansion of renewable energies" },
    { import_id: "CCLW.document.1.2", slug: "an-amendment", title: "Amendment to the renewable energies law" },
    { import_id: "CCLW.document.1.3", slug: "a-decree", title: "Decree on renewable energy sources" },
  ],
} as TFamilyPublic;

const topic = (wikibaseId: string, label: string): TTopic => ({ wikibase_id: wikibaseId, preferred_label: label }) as TTopic;

const familyTopics = {
  conceptCounts: { Q1: 3, Q2: 9, Q3: 11 },
  conceptsGrouped: {
    Q100: [topic("Q1", "Forest fires"), topic("Q2", "Air pollution risk")],
    Q200: [topic("Q3", "Extreme weather")],
  },
  documents: [],
  rootConcepts: [],
} as IFamilyDocumentTopics;

const getCategoryText = () => "law";

const renderViewer = (initialQuery: Record<string, unknown> = {}) => {
  urlQuery.initial = initialQuery;
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  return render(
    <QueryClientProvider client={queryClient}>
      <FamilyPassageViewer family={family} familyTopics={familyTopics} getCategoryText={getCategoryText} />
    </QueryClientProvider>
  );
};

const searchBox = () => screen.getByRole("textbox", { name: /search passages in this law/i });

const openDocumentsFilter = async () => {
  await userEvent.click(screen.getByRole("button", { name: /Documents in this Law/ }));
  const list = await screen.findByRole("list", { name: "Documents in this Law" });
  await waitFor(() => expect(list).toBeVisible());
  return list;
};

describe("FamilyPassageViewer", () => {
  beforeEach(() => {
    urlQuery.initial = {};
    urlQuery.writes = [];
    mockRouter.setCurrentUrl("/document/a-family");
    mockFetchSearchPassages.mockReset();
    mockFetchSearchPassages.mockResolvedValue({ total_size: 1, results: [buildPassage()] });
  });

  describe("searching across the family's documents", () => {
    it("searches every document in the family by default", async () => {
      renderViewer();

      await userEvent.type(searchBox(), "renewable{Enter}");

      await waitFor(() =>
        expect(mockFetchSearchPassages).toHaveBeenCalledWith(
          expect.objectContaining({
            query: "renewable",
            documents: ["CCLW.document.1.1", "CCLW.document.1.2", "CCLW.document.1.3"],
          })
        )
      );
    });

    it("searches only the documents named in the url", async () => {
      renderViewer({ q: "renewable", docs: ["CCLW.document.1.2"] });

      await waitFor(() => expect(mockFetchSearchPassages).toHaveBeenCalledWith(expect.objectContaining({ documents: ["CCLW.document.1.2"] })));
    });

    it("falls back to every document when the url names none it recognises", async () => {
      renderViewer({ q: "renewable", docs: ["CCLW.document.9.9"] });

      await waitFor(() =>
        expect(mockFetchSearchPassages).toHaveBeenCalledWith(
          expect.objectContaining({ documents: ["CCLW.document.1.1", "CCLW.document.1.2", "CCLW.document.1.3"] })
        )
      );
    });
  });

  describe("the documents filter", () => {
    it("counts the documents being searched", async () => {
      renderViewer();

      expect(screen.getByRole("button", { name: "Documents in this Law (3)" })).toBeInTheDocument();
    });

    it("lists every document in the family, all selected to begin with", async () => {
      renderViewer();

      const list = await openDocumentsFilter();

      const checkboxes = within(list).getAllByRole("checkbox");
      expect(checkboxes).toHaveLength(3);
      checkboxes.forEach((checkbox) => expect(checkbox).toBeChecked());
    });

    it("re-runs the search over the remaining documents when one is deselected", async () => {
      renderViewer({ q: "renewable" });
      await waitFor(() => expect(mockFetchSearchPassages).toHaveBeenCalledTimes(1));

      const list = await openDocumentsFilter();
      await userEvent.click(within(list).getByRole("checkbox", { name: /Amendment to the renewable energies law/ }));

      await waitFor(() =>
        expect(mockFetchSearchPassages).toHaveBeenLastCalledWith(expect.objectContaining({ documents: ["CCLW.document.1.1", "CCLW.document.1.3"] }))
      );
    });

    it("puts a narrowed selection in the url so it can be shared", async () => {
      renderViewer({ q: "renewable" });

      const list = await openDocumentsFilter();
      await userEvent.click(within(list).getByRole("checkbox", { name: /Decree on renewable energy sources/ }));

      await waitFor(() => expect(urlQuery.writes).toContainEqual({ key: "docs", value: ["CCLW.document.1.1", "CCLW.document.1.2"] }));
    });

    it("leaves the url clean when every document is selected again", async () => {
      renderViewer({ q: "renewable", docs: ["CCLW.document.1.1", "CCLW.document.1.2"] });

      const list = await openDocumentsFilter();
      await userEvent.click(within(list).getByRole("checkbox", { name: /Decree on renewable energy sources/ }));

      await waitFor(() => expect(urlQuery.writes.at(-1)).toEqual({ key: "docs", value: null }));
    });

    it("holds the last remaining document, as searching none returns nothing", async () => {
      renderViewer({ q: "renewable", docs: ["CCLW.document.1.2"] });
      await waitFor(() => expect(mockFetchSearchPassages).toHaveBeenCalledTimes(1));

      const list = await openDocumentsFilter();
      // Base UI renders the control as a span, so the disabled state is only in ARIA.
      const lastCheckbox = within(list).getByRole("checkbox", { name: /Amendment to the renewable energies law/ });
      expect(lastCheckbox).toHaveAttribute("aria-disabled", "true");

      await userEvent.click(lastCheckbox);

      expect(mockFetchSearchPassages).toHaveBeenCalledTimes(1);
      expect(urlQuery.writes).toHaveLength(0);
    });
  });

  describe("results", () => {
    it("names the document each passage came from", async () => {
      mockFetchSearchPassages.mockResolvedValue({
        total_size: 2,
        results: [buildPassage(), buildPassage({ id: "passage-2", text: "A passage from elsewhere", document_id: "CCLW.document.1.3" })],
      });
      renderViewer({ q: "renewable" });

      expect(await screen.findByText("Law for the expansion of renewable energies")).toBeInTheDocument();
      expect(screen.getByText("Decree on renewable energy sources")).toBeInTheDocument();
    });

    it("reports the number of matches", async () => {
      mockFetchSearchPassages.mockResolvedValue({ total_size: 12, results: [buildPassage()] });
      renderViewer({ q: "renewable" });

      expect(await screen.findByText("12 matching passages")).toBeInTheDocument();
    });

    it("shows the no results state when nothing matches", async () => {
      mockFetchSearchPassages.mockResolvedValue({ total_size: 0, results: [] });
      renderViewer({ q: "renewable" });

      expect(await screen.findByText("No matching passages")).toBeInTheDocument();
    });

    it("shows an error message when the search fails", async () => {
      mockFetchSearchPassages.mockRejectedValue(new Error("Passage search API error: 500"));
      renderViewer({ q: "renewable" });

      expect(await screen.findByText(/Something went wrong with your search/)).toBeInTheDocument();
    });
  });

  describe("following a passage to its document", () => {
    it("opens the document page, carrying the search term over", async () => {
      renderViewer({ q: "renewable" });

      await userEvent.click(await screen.findByRole("button", { name: /Certain ecological/ }));

      await waitFor(() => expect(mockRouter.asPath).toBe("/documents/main-document?q=renewable"));
    });

    it("opens the document in a new tab from the footer link", async () => {
      const open = vi.spyOn(window, "open").mockImplementation(() => null);
      renderViewer({ q: "renewable" });

      await userEvent.click(await screen.findByRole("button", { name: "View document" }));

      expect(open).toHaveBeenCalledWith("/documents/main-document?q=renewable", "_blank");
      open.mockRestore();
    });
  });

  describe("the empty state", () => {
    it("offers the family's most mentioned topics, highest count first", async () => {
      renderViewer();

      const topics = await screen.findAllByRole("button", { name: /Forest fires|Air pollution risk|Extreme weather/ });
      expect(topics.map((button) => button.textContent)).toEqual(["Extreme weather", "Air pollution risk", "Forest fires"]);
    });

    it("searches for a topic when its pill is clicked", async () => {
      renderViewer();

      await userEvent.click(await screen.findByRole("button", { name: "Extreme weather" }));

      await waitFor(() => expect(mockFetchSearchPassages).toHaveBeenCalledWith(expect.objectContaining({ query: "Extreme weather" })));
      expect(searchBox()).toHaveValue("Extreme weather");
    });

    it("speaks of the family's documents in the plural", async () => {
      renderViewer();

      expect(await screen.findByText(/Type a search or select from topics that appear in these documents\./)).toBeInTheDocument();
      expect(screen.getByText("Commonly mentioned in these documents")).toBeInTheDocument();
    });
  });
});
