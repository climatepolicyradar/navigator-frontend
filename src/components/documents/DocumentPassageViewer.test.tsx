import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TopicsContext } from "@/context/TopicsContext";
import { ISearchPassage, TFamilyDocumentPublic, TSearchQueryGroup, TSearchResponse, TTopics } from "@/types";

import { DocumentPassageViewer } from "./DocumentPassageViewer";

// The Adobe viewer needs a real browser, so the preview pane is stubbed out.
vi.mock("@/components/EmbeddedPDF", () => ({
  default: ({ pageNumber }: { pageNumber: number | null }) => <div data-cy="embedded-pdf">page:{pageNumber ?? "none"}</div>,
}));

const mockFetchSearchPassages = vi.hoisted(() => vi.fn());
vi.mock("@/api/passages", () => ({ fetchSearchPassages: mockFetchSearchPassages }));

// A stateful stand-in for the URL params. nuqs' own testing adapter is fully controlled
// and reverts the value after every write, which the component reads as a browser
// navigation. The real adapter (wired in _app.tsx) keeps the value, so this fake
// reproduces production semantics: read the initial value, then hold what is written.
// The store is shared across hook instances and keyed by param, because the viewer and
// its SearchControls both read `q` and `sort`, and a write from one must reach the other.
const url = vi.hoisted(() => {
  const values = new Map<string, unknown>();
  const listeners = new Set<() => void>();
  return {
    reset: () => values.clear(),
    read: (key: string, fallback: unknown) => (values.has(key) ? values.get(key) : fallback),
    write: (key: string, value: unknown) => {
      values.set(key, value);
      listeners.forEach((listener) => listener());
    },
    // nuqs drops a param from the url once it is set back to its parser default, leaving
    // each reader on its own default rather than on a shared null.
    clear: (key: string) => {
      values.delete(key);
      listeners.forEach((listener) => listener());
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return (): void => {
        listeners.delete(listener);
      };
    },
  };
});
vi.mock("nuqs", async (importOriginal) => {
  const actual = await importOriginal<typeof import("nuqs")>();
  const { useSyncExternalStore } = await import("react");
  return {
    ...actual,
    useQueryState: (key: string, parser: { defaultValue?: unknown }) => {
      const read = () => url.read(key, parser?.defaultValue);
      return [
        useSyncExternalStore(url.subscribe, read, read),
        (next: unknown) => {
          url.write(key, next ?? parser?.defaultValue);
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
  if (initialQuery) url.write("q", initialQuery);
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  return render(
    <QueryClientProvider client={queryClient}>
      <TopicsContext.Provider value={topics}>
        <DocumentPassageViewer document={document} vespaDocumentData={vespaDocumentData} />
      </TopicsContext.Provider>
    </QueryClientProvider>
  );
};

// The search input, its submit and its clear button belong to SearchControls, which is
// covered by its own component's tests. The viewer only reacts to the term in the URL, so
// these drive the param directly rather than the markup around it.
const searchFor = async (term: string) => {
  await act(async () => url.write("q", term));
};

// The topic checkboxes belong to SearchControls, so these drive the filter group it writes
// to the url rather than the popover markup.
const topicFilter: TSearchQueryGroup = { op: "or", filters: [{ field: "labels.value.id", op: "contains", value: "concept/Q1", checked: true }] };

const filterBy = async (filters: TSearchQueryGroup) => {
  await act(async () => url.write("filters", filters));
};

const clearFilters = async () => {
  await act(async () => url.clear("filters"));
};

/*
  Base UI keeps the sort positioner hidden until it has measured the trigger, so the popup
  only becomes accessible a tick after the click.
*/
const sortBy = async (optionName: string) => {
  await userEvent.click(screen.getByRole("combobox"));
  await waitFor(() => expect(screen.getByRole("listbox")).toBeVisible());
  await userEvent.click(screen.getByRole("option", { name: optionName }));
};

describe("DocumentPassageViewer", () => {
  beforeEach(() => {
    url.reset();
    mockFetchSearchPassages.mockReset();
    mockFetchSearchPassages.mockResolvedValue({ total_size: 1, results: [buildPassage()] });
  });

  describe("handling the search term", () => {
    it("searches the document for the term in the url", async () => {
      renderViewer("renewable");

      await waitFor(() => expect(mockFetchSearchPassages).toHaveBeenCalledTimes(1));
      expect(mockFetchSearchPassages).toHaveBeenCalledWith(expect.objectContaining({ query: "renewable", documents: ["CCLW.document.1.1"] }));
    });

    it("does not search while there is no term", async () => {
      renderViewer();

      await screen.findByText("Search passages");
      expect(mockFetchSearchPassages).not.toHaveBeenCalled();
    });

    it("returns to the empty state when the term is cleared", async () => {
      renderViewer("renewable");
      await screen.findByText(/Certain ecological/);

      await searchFor("");

      expect(await screen.findByText("Search passages")).toBeInTheDocument();
    });
  });

  describe("handling the filters", () => {
    it("searches again with the filters when they change", async () => {
      renderViewer("renewable");
      await waitFor(() => expect(mockFetchSearchPassages).toHaveBeenCalledTimes(1));

      await filterBy(topicFilter);

      await waitFor(() => expect(mockFetchSearchPassages).toHaveBeenCalledTimes(2));
      expect(mockFetchSearchPassages).toHaveBeenLastCalledWith(expect.objectContaining({ query: "renewable", filters: topicFilter }));
    });

    // A topic on its own is a search: the reader can browse the document's passages by
    // topic without typing a term.
    it("searches on a filter alone, with no term", async () => {
      renderViewer();

      await filterBy(topicFilter);

      await waitFor(() => expect(mockFetchSearchPassages).toHaveBeenCalledTimes(1));
      expect(mockFetchSearchPassages).toHaveBeenCalledWith(expect.objectContaining({ query: "", filters: topicFilter }));
      expect(await screen.findByText(/Certain ecological/)).toBeInTheDocument();
    });

    it("returns to the empty state when the filters are cleared", async () => {
      renderViewer();
      await filterBy(topicFilter);
      await screen.findByText(/Certain ecological/);

      await clearFilters();

      expect(await screen.findByText("Search passages")).toBeInTheDocument();
    });

    it("reports no matches when a filter-only search returns nothing", async () => {
      mockFetchSearchPassages.mockResolvedValue({ total_size: 0, results: [] });
      renderViewer();

      await filterBy(topicFilter);

      expect(await screen.findByText("No matching passages")).toBeInTheDocument();
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

      await searchFor("biomass");

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

      await searchFor("renewable");

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

      await searchFor("renewable");

      expect(await screen.findByText("page:24")).toBeInTheDocument();
    });

    it("jumps to the page of the first result of a filter-only search", async () => {
      mockFetchSearchPassages.mockResolvedValue({ total_size: 1, results: [buildPassage({ pages: [23] })] });
      renderViewer();

      expect(screen.getByText("page:none")).toBeInTheDocument();

      await filterBy(topicFilter);

      expect(await screen.findByText("page:24")).toBeInTheDocument();
    });

    // A different set of topics gives the term a different first match, so the reader
    // follows it rather than being left on the page the previous set picked.
    it("jumps again when the filters change", async () => {
      mockFetchSearchPassages.mockResolvedValue({ total_size: 1, results: [buildPassage({ pages: [10] })] });
      renderViewer("renewable");
      await screen.findByText("page:11");

      mockFetchSearchPassages.mockResolvedValue({ total_size: 1, results: [buildPassage({ id: "b", pages: [55] })] });
      await filterBy(topicFilter);

      expect(await screen.findByText("page:56")).toBeInTheDocument();
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
      await searchFor("biomass");

      expect(await screen.findByText("page:56")).toBeInTheDocument();
    });

    // Re-ordering gives the term a different first match, so the reader follows it rather
    // than being left on the page the previous ordering picked.
    it("jumps again when the sort order changes", async () => {
      mockFetchSearchPassages.mockResolvedValue({ total_size: 1, results: [buildPassage({ pages: [10] })] });
      renderViewer("renewable");
      await screen.findByText("page:11");

      mockFetchSearchPassages.mockResolvedValue({ total_size: 1, results: [buildPassage({ id: "b", pages: [2] })] });
      await sortBy("Page Number");

      expect(await screen.findByText("page:3")).toBeInTheDocument();
      expect(mockFetchSearchPassages).toHaveBeenLastCalledWith(expect.objectContaining({ sort: "idx asc" }));
    });

    it("does not jump when a search returns nothing", async () => {
      mockFetchSearchPassages.mockResolvedValue({ total_size: 0, results: [] });
      renderViewer();

      await searchFor("renewable");

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
    });
  });
});
