import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { ISearchPassage } from "@/api/passages";
import { TopicsContext } from "@/context/TopicsContext";
import { TFamilyDocumentPublic, TSearchResponse, TTopics } from "@/types";

import { DocumentPassageViewer } from "./DocumentPassageViewer";

// The Adobe viewer needs a real browser, so the preview pane is stubbed out.
vi.mock("@/components/EmbeddedPDF", () => ({
  default: ({ pageNumber }: { pageNumber: number | null }) => <div data-cy="embedded-pdf">page:{pageNumber ?? "none"}</div>,
}));

const mockFetchSearchPassages = vi.hoisted(() => vi.fn());
vi.mock("@/api/passages", () => ({ fetchSearchPassages: mockFetchSearchPassages }));

// A stateful stand-in for the `q` URL param. nuqs' own testing adapter is fully
// controlled and reverts the value after every write, which the component reads as a
// browser navigation. The real adapter (wired in _app.tsx) keeps the value, so this fake
// reproduces production semantics: read the initial term, then hold what is written.
const urlQuery = vi.hoisted(() => ({ initial: "", writes: [] as (string | null)[] }));
vi.mock("nuqs", async (importOriginal) => {
  const actual = await importOriginal<typeof import("nuqs")>();
  const { useState } = await import("react");
  return {
    ...actual,
    useQueryState: () => {
      const [value, setValue] = useState(urlQuery.initial);
      return [
        value,
        (next: string | null) => {
          urlQuery.writes.push(next);
          setValue(next ?? "");
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

const document = {
  cdn_object: "https://cdn.example.org/document.pdf",
  import_id: "CCLW.document.1.1",
  slug: "a-document",
  title: "Law for the expansion of renewable energies",
} as TFamilyDocumentPublic;

const topics: TTopics = {
  rootTopics: [],
  topics: [
    { wikibase_id: "Q1", preferred_label: "Extreme weather" },
    { wikibase_id: "Q2", preferred_label: "Air pollution risk" },
  ] as TTopics["topics"],
};

const vespaDocumentData = {
  families: [
    {
      id: "family-1",
      hits: [
        { concept_counts: { "Q1:extreme weather": 3, "Q2:air pollution risk": 9 } },
        // The same concept spread over a second hit, to prove counts are summed.
        { concept_counts: { "Q1:extreme weather": 8 } },
      ],
    },
  ],
} as unknown as TSearchResponse;

const renderViewer = (initialQuery = "") => {
  urlQuery.initial = initialQuery;
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  return render(
    <QueryClientProvider client={queryClient}>
      <TopicsContext.Provider value={topics}>
        <DocumentPassageViewer document={document} vespaDocumentData={vespaDocumentData} />
      </TopicsContext.Provider>
    </QueryClientProvider>
  );
};

const searchBox = () => screen.getByRole("searchbox", { name: /search passages/i });

// The Input atom's clear control is an unlabelled icon button, so it is reached through
// the search landmark rather than by name.
const clearButton = () => within(screen.getByRole("search")).getByRole("button");

describe("DocumentPassageViewer", () => {
  beforeEach(() => {
    urlQuery.initial = "";
    urlQuery.writes = [];
    mockFetchSearchPassages.mockReset();
    mockFetchSearchPassages.mockResolvedValue({ total_size: 1, results: [buildPassage()] });
  });

  describe("handling the search term", () => {
    it("does not search until the user submits a term", async () => {
      renderViewer();
      await screen.findByText("Search passages");

      await userEvent.type(searchBox(), "renewable");

      expect(mockFetchSearchPassages).not.toHaveBeenCalled();
    });

    it("searches the document for the term when the user presses enter", async () => {
      renderViewer();

      await userEvent.type(searchBox(), "renewable{Enter}");

      await waitFor(() => expect(mockFetchSearchPassages).toHaveBeenCalledTimes(1));
      expect(mockFetchSearchPassages).toHaveBeenCalledWith(expect.objectContaining({ query: "renewable", documentId: "CCLW.document.1.1" }));
    });

    it("puts the submitted term in the url so the search can be shared", async () => {
      renderViewer();

      await userEvent.type(searchBox(), "renewable{Enter}");

      await waitFor(() => expect(urlQuery.writes).toContain("renewable"));
    });

    it("trims surrounding whitespace from the term", async () => {
      renderViewer();

      await userEvent.type(searchBox(), "  renewable  {Enter}");

      await waitFor(() => expect(mockFetchSearchPassages).toHaveBeenCalledWith(expect.objectContaining({ query: "renewable" })));
    });

    it("does not search when the term is only whitespace", async () => {
      renderViewer();

      await userEvent.type(searchBox(), "   {Enter}");

      expect(mockFetchSearchPassages).not.toHaveBeenCalled();
    });

    it("runs the search from the url on first render", async () => {
      renderViewer("renewable");

      await waitFor(() => expect(mockFetchSearchPassages).toHaveBeenCalledWith(expect.objectContaining({ query: "renewable" })));
      expect(searchBox()).toHaveValue("renewable");
    });

    it("keeps the term the user is typing, and only searches the submitted one", async () => {
      renderViewer("renewable");
      await screen.findByText(/Certain ecological/);

      await userEvent.clear(searchBox());
      await userEvent.type(searchBox(), "biomass");

      expect(searchBox()).toHaveValue("biomass");
      expect(mockFetchSearchPassages).toHaveBeenCalledTimes(1);
      expect(mockFetchSearchPassages).toHaveBeenCalledWith(expect.objectContaining({ query: "renewable" }));
    });

    it("clears the term and returns to the empty state", async () => {
      renderViewer("renewable");
      await screen.findByText(/Certain ecological/);

      await userEvent.click(clearButton());

      await waitFor(() => expect(searchBox()).toHaveValue(""));
      expect(screen.getByText("Search passages")).toBeInTheDocument();
      expect(urlQuery.writes.at(-1)).toBeNull();
    });
  });

  describe("results", () => {
    it("renders a PassageBlock per result, without the document title", async () => {
      renderViewer("renewable");

      expect(await screen.findByText(/Certain ecological/)).toBeInTheDocument();
      expect(screen.getByText("Pg. 17")).toBeInTheDocument();
      expect(screen.getByText("Section 4: National Target 16")).toBeInTheDocument();
      // The reader is already on this document, so its title is not repeated per passage.
      expect(screen.queryByText(document.title)).not.toBeInTheDocument();
    });

    it("reports the number of matches", async () => {
      mockFetchSearchPassages.mockResolvedValue({ total_size: 12, results: [buildPassage()] });
      renderViewer("renewable");

      expect(await screen.findByText("12 matching passages")).toBeInTheDocument();
    });

    it("moves the preview to the passage page when a passage is clicked", async () => {
      // A second passage well away from the first, so the click is what moves the reader
      // rather than the jump to the first result.
      mockFetchSearchPassages.mockResolvedValue({
        total_size: 2,
        results: [buildPassage(), buildPassage({ id: "passage-2", text: "A later passage", pages: [40] })],
      });
      renderViewer("renewable");

      await userEvent.click(await screen.findByRole("button", { name: /A later passage/ }));

      expect(await screen.findByText("page:41")).toBeInTheDocument();
    });

    it("shows the no results state when nothing matches", async () => {
      mockFetchSearchPassages.mockResolvedValue({ total_size: 0, results: [] });
      renderViewer("renewable");

      expect(await screen.findByText("No matching passages")).toBeInTheDocument();
      expect(screen.getByText("0 matching passages")).toBeInTheDocument();
    });

    it("shows an error message when the search fails", async () => {
      mockFetchSearchPassages.mockRejectedValue(new Error("Passage search API error: 500"));
      renderViewer("renewable");

      expect(await screen.findByText(/Something went wrong with your search/)).toBeInTheDocument();
    });
  });

  describe("switching between search terms", () => {
    // Lets a search be left in flight so the intermediate render can be inspected.
    const deferredPage = () => {
      let resolvePage: (value: unknown) => void;
      const promise = new Promise((resolve) => {
        resolvePage = resolve;
      });
      return { promise, resolve: (value: unknown) => resolvePage(value) };
    };

    it("does not show the previous term's results while the next one loads", async () => {
      const second = deferredPage();
      mockFetchSearchPassages
        .mockResolvedValueOnce({ total_size: 1, results: [buildPassage({ id: "a", text: "First term result" })] })
        .mockReturnValueOnce(second.promise);
      renderViewer("renewable");
      await screen.findByText("First term result");

      await userEvent.clear(searchBox());
      await userEvent.type(searchBox(), "biomass{Enter}");

      // The second search is still in flight here.
      expect(screen.queryByText("First term result")).not.toBeInTheDocument();
      expect(screen.queryByText("No matching passages")).not.toBeInTheDocument();

      second.resolve({ total_size: 1, results: [buildPassage({ id: "b", text: "Second term result" })] });
      expect(await screen.findByText("Second term result")).toBeInTheDocument();
    });

    it("does not flash the no-results state while a search is in flight", async () => {
      const search = deferredPage();
      mockFetchSearchPassages.mockReturnValueOnce(search.promise);
      renderViewer();

      await userEvent.type(searchBox(), "renewable{Enter}");

      expect(screen.queryByText("No matching passages")).not.toBeInTheDocument();
      expect(screen.queryByText("Search passages")).not.toBeInTheDocument();

      search.resolve({ total_size: 0, results: [] });
      expect(await screen.findByText("No matching passages")).toBeInTheDocument();
    });
  });

  describe("moving the preview to the first result", () => {
    it("jumps to the page of the first result when a search returns", async () => {
      mockFetchSearchPassages.mockResolvedValue({ total_size: 1, results: [buildPassage({ pages: [23] })] });
      renderViewer();

      expect(screen.getByText("page:none")).toBeInTheDocument();

      await userEvent.type(searchBox(), "renewable{Enter}");

      expect(await screen.findByText("page:24")).toBeInTheDocument();
    });

    it("stays put when another page of results is loaded", async () => {
      mockFetchSearchPassages
        .mockResolvedValueOnce({ total_size: 4, results: [buildPassage({ id: "a", pages: [10] })] })
        .mockResolvedValueOnce({ total_size: 4, results: [buildPassage({ id: "b", text: "Second page", pages: [80] })] });
      renderViewer("renewable");
      await screen.findByText("page:11");

      await userEvent.click(await screen.findByRole("button", { name: /load more/i }));
      await screen.findByText("Second page");

      expect(screen.getByText("page:11")).toBeInTheDocument();
    });

    it("stays put after the reader has clicked through to another passage", async () => {
      mockFetchSearchPassages.mockResolvedValue({
        total_size: 2,
        results: [buildPassage({ id: "a", pages: [10] }), buildPassage({ id: "b", text: "A later passage", pages: [80] })],
      });
      renderViewer("renewable");
      await screen.findByText("page:11");

      await userEvent.click(screen.getByRole("button", { name: /A later passage/ }));

      expect(await screen.findByText("page:81")).toBeInTheDocument();
    });

    it("jumps again when a new search returns", async () => {
      mockFetchSearchPassages.mockResolvedValue({ total_size: 1, results: [buildPassage({ pages: [10] })] });
      renderViewer("renewable");
      await screen.findByText("page:11");

      mockFetchSearchPassages.mockResolvedValue({ total_size: 1, results: [buildPassage({ id: "b", pages: [55] })] });
      await userEvent.clear(searchBox());
      await userEvent.type(searchBox(), "biomass{Enter}");

      expect(await screen.findByText("page:56")).toBeInTheDocument();
    });

    it("does not jump when a search returns nothing", async () => {
      mockFetchSearchPassages.mockResolvedValue({ total_size: 0, results: [] });
      renderViewer();

      await userEvent.type(searchBox(), "renewable{Enter}");

      await screen.findByText("No matching passages");
      expect(screen.getByText("page:none")).toBeInTheDocument();
    });
  });

  describe("loading more results", () => {
    const pageOf = (ids: string[], total: number) => ({
      total_size: total,
      results: ids.map((id) => buildPassage({ id, text: `Passage ${id}` })),
    });

    it("starts at the first page", async () => {
      renderViewer("renewable");

      await waitFor(() => expect(mockFetchSearchPassages).toHaveBeenCalledWith(expect.objectContaining({ pageToken: 1 })));
    });

    it("does not offer more when every result is already loaded", async () => {
      mockFetchSearchPassages.mockResolvedValue(pageOf(["a", "b"], 2));
      renderViewer("renewable");

      await screen.findByText("Passage a");
      expect(screen.queryByRole("button", { name: /load more/i })).not.toBeInTheDocument();
    });

    it("offers more when the total exceeds what is loaded", async () => {
      mockFetchSearchPassages.mockResolvedValue(pageOf(["a", "b"], 5));
      renderViewer("renewable");

      expect(await screen.findByRole("button", { name: /load more/i })).toBeInTheDocument();
      expect(screen.getByText("Showing 2 of 5")).toBeInTheDocument();
    });

    it("requests the next page and appends it below the first", async () => {
      mockFetchSearchPassages.mockResolvedValueOnce(pageOf(["a", "b"], 4)).mockResolvedValueOnce(pageOf(["c", "d"], 4));
      renderViewer("renewable");

      await userEvent.click(await screen.findByRole("button", { name: /load more/i }));

      expect(await screen.findByText("Passage c")).toBeInTheDocument();
      expect(screen.getByText("Passage a")).toBeInTheDocument();
      expect(mockFetchSearchPassages).toHaveBeenLastCalledWith(expect.objectContaining({ pageToken: 2 }));
    });

    it("stops offering more once the last page has arrived", async () => {
      mockFetchSearchPassages.mockResolvedValueOnce(pageOf(["a", "b"], 4)).mockResolvedValueOnce(pageOf(["c", "d"], 4));
      renderViewer("renewable");

      await userEvent.click(await screen.findByRole("button", { name: /load more/i }));

      await screen.findByText("Passage d");
      expect(screen.queryByRole("button", { name: /load more/i })).not.toBeInTheDocument();
    });

    it("stops offering more when a page comes back empty despite an over-reported total", async () => {
      mockFetchSearchPassages.mockResolvedValueOnce(pageOf(["a"], 99)).mockResolvedValueOnce(pageOf([], 99));
      renderViewer("renewable");

      await userEvent.click(await screen.findByRole("button", { name: /load more/i }));

      await waitFor(() => expect(screen.queryByRole("button", { name: /load more/i })).not.toBeInTheDocument());
      // The results already on screen survive the empty page.
      expect(screen.getByText("Passage a")).toBeInTheDocument();
    });
  });

  describe("empty state concepts", () => {
    it("lists the document's most common concepts, highest count first", async () => {
      renderViewer();

      const concepts = await screen.findAllByRole("button", { name: /Extreme weather|Air pollution risk/ });
      // Extreme weather totals 11 across two hits, ahead of air pollution risk on 9.
      expect(concepts.map((concept) => concept.textContent)).toEqual(["Extreme weather", "Air pollution risk"]);
    });

    it("searches for a concept when its pill is clicked", async () => {
      renderViewer();

      await userEvent.click(await screen.findByRole("button", { name: "Extreme weather" }));

      await waitFor(() => expect(mockFetchSearchPassages).toHaveBeenCalledWith(expect.objectContaining({ query: "Extreme weather" })));
      expect(searchBox()).toHaveValue("Extreme weather");
    });
  });
});
