import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockRouter from "next-router-mock";
import * as nextRouterMock from "next-router-mock";

import { TOPIC_HIGHLIGHT_COLOURS as TOPIC_COLOURS } from "@/components/molecules/passageBlock/PassageBlock";
import { SearchLevelContext } from "@/context/SearchLevelContext";
import { IPassageLabel, ISearchPassage, TFamilyDocumentPublic, TSearchQueryGroup, TTopic } from "@/types";

import { PassageSearch } from "./PassageSearch";

vi.mock("next/router", () => nextRouterMock);

// The Adobe viewer needs a real browser, so the preview pane is stubbed out.
vi.mock("@/components/EmbeddedPDF", () => ({
  default: ({ pageNumber }: { pageNumber: number | null }) => <div data-cy="embedded-pdf">page:{pageNumber ?? "none"}</div>,
}));

const mockFetchSearchPassages = vi.hoisted(() => vi.fn());
vi.mock("@/api/passages", () => ({ fetchSearchPassages: mockFetchSearchPassages }));

// The label lookup only populates the Topic filter's options, which belong to SearchControls.
// Stubbed so the suite makes no network calls of its own.
vi.mock("@/hooks/useLabelSearch", () => ({ loadFilteredLabels: () => Promise.resolve([]) }));

// A stateful stand-in for the URL params. nuqs' own testing adapter is fully controlled and
// reverts the value after every write, which the component reads as a browser navigation.
// The real adapter (wired in _app.tsx) keeps the value, so this fake reproduces production
// semantics: read the initial value, then hold what is written. The store is shared across
// hook instances and keyed by param, because the viewer and its SearchControls both read
// `q`, `filters` and `sort`, and a write from one must reach the other.
const url = vi.hoisted(() => {
  const values = new Map<string, unknown>();
  const listeners = new Set<() => void>();
  const notify = () => listeners.forEach((listener) => listener());
  return {
    // Every write the component made, so URL side effects can be asserted directly.
    writes: [] as { key: string; value: unknown }[],
    reset: () => {
      values.clear();
      url.writes = [];
    },
    // Puts a param in place as though the page had been opened with it, without logging a write.
    seed: (key: string, value: unknown) => {
      values.set(key, value);
      notify();
    },
    read: (key: string, fallback: unknown) => (values.has(key) ? values.get(key) : fallback),
    write: (key: string, value: unknown, fallback?: unknown) => {
      url.writes.push({ key, value });
      // Clearing a param removes it from the url, leaving every reader on its own default rather
      // than on a shared null - two components read `filters` with different defaults.
      if (value === null || value === undefined) values.delete(key);
      else values.set(key, value ?? fallback);
      notify();
    },
    // nuqs drops a param from the url once it is set back to its parser default, leaving
    // each reader on its own default rather than on a shared null.
    clear: (key: string) => {
      values.delete(key);
      notify();
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
          url.write(key, next, parser?.defaultValue);
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
  heading_id: "heading-1",
  heading_text: "Section 4: National Target 16",
  document_id: "CCLW.document.1.1",
  principal_id: "CCLW.family.1.0",
  tokens: [],
  ...overrides,
});

const mainDocument = {
  cdn_object: "https://cdn.example.org/document.pdf",
  import_id: "CCLW.document.1.1",
  slug: "main-document",
  title: "Law for the expansion of renewable energies",
} as TFamilyDocumentPublic;

const principalDocuments = [
  mainDocument,
  { import_id: "CCLW.document.1.2", slug: "an-amendment", title: "Amendment to the renewable energies law" },
  { import_id: "CCLW.document.1.3", slug: "a-decree", title: "Decree on renewable energy sources" },
] as TFamilyDocumentPublic[];

const concepts = [
  { wikibase_id: "Q1", preferred_label: "Extreme weather" },
  { wikibase_id: "Q2", preferred_label: "Air pollution risk" },
] as TTopic[];

const renderWith = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
};

// The document page: one document, with the PDF preview alongside the results.
const renderWithPreview = (initialParams: Record<string, unknown> = {}) => {
  Object.entries(initialParams).forEach(([key, value]) => url.seed(key, value));
  return renderWith(<PassageSearch documents={[mainDocument]} concepts={concepts} enablePreview />);
};

// The principal page: several documents, full width, no preview.
const renderPrincipal = (initialParams: Record<string, unknown> = {}, documents = principalDocuments) => {
  Object.entries(initialParams).forEach(([key, value]) => url.seed(key, value));
  return renderWith(<PassageSearch documents={documents} concepts={concepts} documentsLabel="Documents in this Law" subject="these documents" />);
};

// The search input, its submit and its clear button belong to SearchControls, which is
// covered by its own component's tests. The viewer only reacts to the term in the URL, so
// these drive the param directly rather than the markup around it.
const searchFor = async (term: string) => {
  await act(async () => url.seed("q", term));
};

// The topic checkboxes belong to SearchControls, so these drive the filter group it writes
// to the url rather than the popover markup.
const topicFilter: TSearchQueryGroup = { op: "or", filters: [{ field: "labels.value.id", op: "contains", value: "concept::Q1", checked: true }] };

// A label as the passage API reports it: a concept id and the span of text it marks.
const makeLabel = (id: string, startIndex: number, endIndex: number): IPassageLabel => ({
  classifier_id: `classifier-${id}`,
  start_index: startIndex,
  end_index: endIndex,
  labelled_text: "",
  labellers: ["classifier"],
  value: { id, type: "concept", value: id },
});

// A geography filter, as the results page writes it - not this search's to apply.
const countryRule = { field: "labels.value.id", op: "contains", value: "country::LVA", checked: true } as const;

const filterBy = async (filters: TSearchQueryGroup) => {
  await act(async () => url.seed("filters", filters));
};

const clearFilters = async () => {
  await act(async () => url.clear("filters"));
};

/*
  Base UI keeps the popup positioner hidden until it has measured the trigger, so the popup
  only becomes accessible a tick after the click.
*/
const sortBy = async (optionName: string) => {
  await userEvent.click(screen.getByRole("combobox"));
  await waitFor(() => expect(screen.getByRole("listbox")).toBeVisible());
  await userEvent.click(screen.getByRole("option", { name: optionName }));
};

const openDocumentsFilter = async () => {
  await userEvent.click(screen.getByRole("button", { name: /Documents in this Law/ }));
  const list = await screen.findByRole("list", { name: "Documents in this Law" });
  await waitFor(() => expect(list).toBeVisible());
  return list;
};

describe("PassageSearch", () => {
  beforeEach(() => {
    url.reset();
    mockRouter.setCurrentUrl("/documents/main-document");
    mockFetchSearchPassages.mockReset();
    mockFetchSearchPassages.mockResolvedValue({ total_size: 1, results: [buildPassage()] });
  });

  describe("handling the search term", () => {
    it("searches the scope for the term in the url", async () => {
      renderWithPreview({ q: "renewable" });

      await waitFor(() => expect(mockFetchSearchPassages).toHaveBeenCalledTimes(1));
      expect(mockFetchSearchPassages).toHaveBeenCalledWith(expect.objectContaining({ query: "renewable", documents: ["CCLW.document.1.1"] }));
    });

    it("searches when a term is submitted in the search box", async () => {
      renderWithPreview();

      await userEvent.type(screen.getByRole("textbox"), "renewable{Enter}");

      await waitFor(() => expect(mockFetchSearchPassages).toHaveBeenCalledWith(expect.objectContaining({ query: "renewable" })));
    });

    it("does not search while there is no term", async () => {
      renderWithPreview();

      await screen.findByText("Search passages");
      expect(mockFetchSearchPassages).not.toHaveBeenCalled();
    });

    it("returns to the empty state when the term is cleared", async () => {
      renderWithPreview({ q: "renewable" });
      await screen.findByText(/Certain ecological/);

      await searchFor("");

      expect(await screen.findByText("Search passages")).toBeInTheDocument();
    });
  });

  describe("handling the filters", () => {
    it("searches again with the filters when they change", async () => {
      renderWithPreview({ q: "renewable" });
      await waitFor(() => expect(mockFetchSearchPassages).toHaveBeenCalledTimes(1));

      await filterBy(topicFilter);

      await waitFor(() => expect(mockFetchSearchPassages).toHaveBeenCalledTimes(2));
      expect(mockFetchSearchPassages).toHaveBeenLastCalledWith(expect.objectContaining({ query: "renewable", filters: topicFilter }));
    });

    // A topic on its own is a search: the reader can browse passages by topic without typing a term.
    it("searches on a filter alone, with no term", async () => {
      renderWithPreview();

      await filterBy(topicFilter);

      await waitFor(() => expect(mockFetchSearchPassages).toHaveBeenCalledTimes(1));
      expect(mockFetchSearchPassages).toHaveBeenCalledWith(expect.objectContaining({ query: "", filters: topicFilter }));
      expect(await screen.findByText(/Certain ecological/)).toBeInTheDocument();
    });

    it("returns to the empty state when the filters are cleared", async () => {
      renderWithPreview();
      await filterBy(topicFilter);
      await screen.findByText(/Certain ecological/);

      await clearFilters();

      expect(await screen.findByText("Search passages")).toBeInTheDocument();
    });

    it("filters on the principal page too", async () => {
      renderPrincipal({ q: "renewable" });
      await waitFor(() => expect(mockFetchSearchPassages).toHaveBeenCalledTimes(1));

      await filterBy(topicFilter);

      await waitFor(() => expect(mockFetchSearchPassages).toHaveBeenLastCalledWith(expect.objectContaining({ filters: topicFilter })));
    });

    // The topics the reader ticked are the ones highlighted in the passage text, so the
    // filters are the single source of truth for what counts as an active topic.
    describe("highlighting the filtered topics", () => {
      // "Certain ecological and other requirements for the areas used by cultivation."
      const labelledPassage = buildPassage({
        labels: [makeLabel("concept::Q1", 8, 18), makeLabel("concept::Q2", 64, 75)],
      });

      it("highlights the passage text a checked topic marks", async () => {
        mockFetchSearchPassages.mockResolvedValue({ total_size: 1, results: [labelledPassage] });
        renderPrincipal();

        await filterBy(topicFilter);

        expect(await screen.findByText("ecological")).toHaveClass(TOPIC_COLOURS[0]);
        // The other label is on the passage but its topic was not ticked
        expect(screen.queryByText("cultivation")).not.toBeInTheDocument();
      });

      it("highlights nothing when there are no filters", async () => {
        mockFetchSearchPassages.mockResolvedValue({ total_size: 1, results: [labelledPassage] });
        renderPrincipal({ q: "renewable" });

        expect(await screen.findByText(labelledPassage.text)).toBeInTheDocument();
        expect(screen.queryByText("ecological")).not.toBeInTheDocument();
      });

      // A filter path carries its ancestors as unchecked rules to scope their descendants.
      // Those are not selections, so they must not be highlighted.
      it("ignores the unchecked rules that only scope a filter path", async () => {
        mockFetchSearchPassages.mockResolvedValue({ total_size: 1, results: [labelledPassage] });
        renderPrincipal();

        await filterBy({
          op: "and",
          filters: [
            { field: "labels.value.id", op: "contains", value: "concept::Q2" },
            { op: "or", filters: [{ field: "labels.value.id", op: "contains", value: "concept::Q1", checked: true }] },
          ],
        });

        expect(await screen.findByText("ecological")).toHaveClass(TOPIC_COLOURS[0]);
        expect(screen.queryByText("cultivation")).not.toBeInTheDocument();
      });

      it("stops highlighting a topic once its filter is cleared", async () => {
        mockFetchSearchPassages.mockResolvedValue({ total_size: 1, results: [labelledPassage] });
        renderPrincipal({ q: "renewable" });
        await filterBy(topicFilter);
        await screen.findByText("ecological");

        await clearFilters();

        expect(await screen.findByText(labelledPassage.text)).toBeInTheDocument();
        expect(screen.queryByText("ecological")).not.toBeInTheDocument();
      });
    });

    /*
      Only topics are offered here, so anything else in the parameter belongs to another search -
      the results page filters documents by geography and category on the same shape.
    */
    describe("filters it does not own", () => {
      it("searches on the topics alone, leaving the rest of the filters behind", async () => {
        renderWithPreview({ q: "renewable", filters: { op: "and", filters: [...topicFilter.filters, countryRule] } });

        await waitFor(() => expect(mockFetchSearchPassages).toHaveBeenCalledTimes(1));
        expect(mockFetchSearchPassages).toHaveBeenCalledWith(expect.objectContaining({ filters: { op: "and", filters: topicFilter.filters } }));
      });

      it("does not narrow a search when one changes", async () => {
        renderWithPreview({ q: "renewable" });
        await waitFor(() => expect(mockFetchSearchPassages).toHaveBeenCalledTimes(1));

        await filterBy({ op: "and", filters: [countryRule] });

        expect(mockFetchSearchPassages).toHaveBeenCalledTimes(1);
        expect(mockFetchSearchPassages).toHaveBeenLastCalledWith(expect.objectContaining({ filters: null }));
      });

      it("is not a search of its own", async () => {
        renderWithPreview({ filters: { op: "and", filters: [countryRule] } });

        expect(await screen.findByText("Search passages")).toBeInTheDocument();
        expect(mockFetchSearchPassages).not.toHaveBeenCalled();
      });
    });
  });

  /*
    A drawer searches at its own level, on namespaced params, so the search on the page behind it
    is left alone.
  */
  describe("searching at a nested level", () => {
    const renderInDrawer = (initialParams: Record<string, unknown> = {}) => {
      Object.entries(initialParams).forEach(([key, value]) => url.seed(key, value));
      return renderWith(
        <SearchLevelContext value="principal">
          <PassageSearch documents={principalDocuments} concepts={concepts} subject="these documents" />
        </SearchLevelContext>
      );
    };

    it("searches on the level's own params", async () => {
      renderInDrawer({ principal_q: "renewable", principal_filters: topicFilter, principal_sort: "idx asc", principal_docs: ["CCLW.document.1.2"] });

      await waitFor(() => expect(mockFetchSearchPassages).toHaveBeenCalledTimes(1));
      expect(mockFetchSearchPassages).toHaveBeenCalledWith(
        expect.objectContaining({ query: "renewable", filters: topicFilter, sort: "idx asc", documents: ["CCLW.document.1.2"] })
      );
    });

    it("ignores the search on the page behind it", async () => {
      renderInDrawer({ q: "renewable", filters: topicFilter, sort: "idx asc" });

      expect(await screen.findByText("Search passages")).toBeInTheDocument();
      expect(mockFetchSearchPassages).not.toHaveBeenCalled();
    });

    it("writes only its own params", async () => {
      renderInDrawer({ principal_q: "renewable" });

      await userEvent.type(screen.getByRole("textbox"), " targets{Enter}");

      await waitFor(() => expect(url.writes).toEqual([{ key: "principal_q", value: "renewable targets" }]));
    });

    it("clears only its own search", async () => {
      mockFetchSearchPassages.mockResolvedValue({ total_size: 0, results: [] });
      renderInDrawer({ principal_q: "renewable", principal_filters: topicFilter });
      await screen.findByText("No matching passages");

      await userEvent.click(screen.getByRole("button", { name: "clear your search" }));

      expect(url.writes).toEqual([
        { key: "principal_q", value: "" },
        { key: "principal_filters", value: null },
      ]);
    });
  });

  describe("results", () => {
    it("reports the number of matches", async () => {
      mockFetchSearchPassages.mockResolvedValue({ total_size: 12, results: [buildPassage()] });
      renderPrincipal({ q: "renewable" });

      expect(await screen.findByText("12 matching passages")).toBeInTheDocument();
    });

    it("shows the no results state when nothing matches", async () => {
      mockFetchSearchPassages.mockResolvedValue({ total_size: 0, results: [] });
      renderWithPreview({ q: "renewable" });

      expect(await screen.findByText("No matching passages")).toBeInTheDocument();
    });

    it("shows an error message when the search fails", async () => {
      mockFetchSearchPassages.mockRejectedValue(new Error("Passage search API error: 500"));
      renderWithPreview({ q: "renewable" });

      expect(await screen.findByText(/Something went wrong with your search/)).toBeInTheDocument();
    });

    it("does not show the previous term's results while the next one loads", async () => {
      const second = deferredPage();
      mockFetchSearchPassages
        .mockResolvedValueOnce({ total_size: 1, results: [buildPassage({ id: "a", text: "First term result" })] })
        .mockReturnValueOnce(second.promise);
      renderWithPreview({ q: "renewable" });
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
      renderWithPreview();

      await searchFor("renewable");

      expect(screen.queryByText("No matching passages")).not.toBeInTheDocument();
      expect(screen.queryByText("Search passages")).not.toBeInTheDocument();

      search.resolve({ total_size: 0, results: [] });
      expect(await screen.findByText("No matching passages")).toBeInTheDocument();
    });
  });

  describe("with a preview alongside", () => {
    it("renders a PassageBlock per result, without the document title", async () => {
      renderWithPreview({ q: "renewable" });

      expect(await screen.findByText(/Certain ecological/)).toBeInTheDocument();
      expect(screen.getByText("Pg. 17")).toBeInTheDocument();
      expect(screen.getByText("Section 4: National Target 16")).toBeInTheDocument();
      // The reader is already on this document, so its title is not repeated per passage.
      expect(screen.queryByText(mainDocument.title)).not.toBeInTheDocument();
    });

    it("does not offer the documents filter for a single document", async () => {
      renderWithPreview();

      await screen.findByText("Search passages");
      expect(screen.queryByRole("button", { name: /Documents in/ })).not.toBeInTheDocument();
    });

    it("jumps to the page of the first result when a search returns", async () => {
      mockFetchSearchPassages.mockResolvedValue({ total_size: 1, results: [buildPassage({ pages: [23] })] });
      renderWithPreview();

      expect(screen.getByText("page:none")).toBeInTheDocument();

      await searchFor("renewable");

      expect(await screen.findByText("page:24")).toBeInTheDocument();
    });

    it("jumps to the page of the first result of a filter-only search", async () => {
      mockFetchSearchPassages.mockResolvedValue({ total_size: 1, results: [buildPassage({ pages: [23] })] });
      renderWithPreview();

      expect(screen.getByText("page:none")).toBeInTheDocument();

      await filterBy(topicFilter);

      expect(await screen.findByText("page:24")).toBeInTheDocument();
    });

    // A different set of topics gives the term a different first match, so the reader
    // follows it rather than being left on the page the previous set picked.
    it("jumps again when the filters change", async () => {
      mockFetchSearchPassages.mockResolvedValue({ total_size: 1, results: [buildPassage({ pages: [10] })] });
      renderWithPreview({ q: "renewable" });
      await screen.findByText("page:11");

      mockFetchSearchPassages.mockResolvedValue({ total_size: 1, results: [buildPassage({ id: "b", pages: [55] })] });
      await filterBy(topicFilter);

      expect(await screen.findByText("page:56")).toBeInTheDocument();
    });

    it("moves the preview to the passage page when a passage is clicked", async () => {
      // A second passage well away from the first, so the click is what moves the reader
      // rather than the jump to the first result.
      mockFetchSearchPassages.mockResolvedValue({
        total_size: 2,
        results: [buildPassage(), buildPassage({ id: "passage-2", text: "A later passage", pages: [40] })],
      });
      renderWithPreview({ q: "renewable" });

      await userEvent.click(await screen.findByRole("button", { name: /A later passage/ }));

      expect(await screen.findByText("page:41")).toBeInTheDocument();
    });

    it("stays put when another page of results is loaded", async () => {
      mockFetchSearchPassages
        .mockResolvedValueOnce({ total_size: 4, results: [buildPassage({ id: "a", pages: [10] })] })
        .mockResolvedValueOnce({ total_size: 4, results: [buildPassage({ id: "b", text: "Second page", pages: [80] })] });
      renderWithPreview({ q: "renewable" });
      await screen.findByText("page:11");

      await userEvent.click(await screen.findByRole("button", { name: /load more/i }));
      await screen.findByText("Second page");

      expect(screen.getByText("page:11")).toBeInTheDocument();
    });

    it("jumps again when the sort order changes", async () => {
      mockFetchSearchPassages.mockResolvedValue({ total_size: 1, results: [buildPassage({ pages: [10] })] });
      renderWithPreview({ q: "renewable" });
      await screen.findByText("page:11");

      mockFetchSearchPassages.mockResolvedValue({ total_size: 1, results: [buildPassage({ id: "b", pages: [2] })] });
      await sortBy("Page Number");

      expect(await screen.findByText("page:3")).toBeInTheDocument();
      expect(mockFetchSearchPassages).toHaveBeenLastCalledWith(expect.objectContaining({ sort: "idx asc" }));
    });

    it("does not jump when a search returns nothing", async () => {
      mockFetchSearchPassages.mockResolvedValue({ total_size: 0, results: [] });
      renderWithPreview();

      await searchFor("renewable");

      await screen.findByText("No matching passages");
      expect(screen.getByText("page:none")).toBeInTheDocument();
    });

    it("offers no preview when the document is not a PDF", async () => {
      renderWith(
        <PassageSearch documents={[{ ...mainDocument, cdn_object: "https://cdn.example.org/document.html" }]} concepts={concepts} enablePreview />
      );

      await screen.findByText("Search passages");
      expect(screen.queryByText(/^page:/)).not.toBeInTheDocument();
    });
  });

  describe("across a principal's documents", () => {
    it("searches every document by default", async () => {
      renderPrincipal({ q: "renewable" });

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
      renderPrincipal({ q: "renewable", docs: ["CCLW.document.1.2"] });

      await waitFor(() => expect(mockFetchSearchPassages).toHaveBeenCalledWith(expect.objectContaining({ documents: ["CCLW.document.1.2"] })));
    });

    it("falls back to every document when the url names none it recognises", async () => {
      renderPrincipal({ q: "renewable", docs: ["CCLW.document.9.9"] });

      await waitFor(() =>
        expect(mockFetchSearchPassages).toHaveBeenCalledWith(
          expect.objectContaining({ documents: ["CCLW.document.1.1", "CCLW.document.1.2", "CCLW.document.1.3"] })
        )
      );
    });

    it("names the document each passage came from", async () => {
      mockFetchSearchPassages.mockResolvedValue({
        total_size: 2,
        results: [buildPassage(), buildPassage({ id: "passage-2", text: "A passage from elsewhere", document_id: "CCLW.document.1.3" })],
      });
      renderPrincipal({ q: "renewable" });

      expect(await screen.findByText("Law for the expansion of renewable energies")).toBeInTheDocument();
      expect(screen.getByText("Decree on renewable energy sources")).toBeInTheDocument();
    });

    it("shows no preview pane", async () => {
      renderPrincipal({ q: "renewable" });

      await screen.findByText(/Certain ecological/);
      expect(screen.queryByText(/^page:/)).not.toBeInTheDocument();
    });

    it("speaks of the documents in the plural", async () => {
      renderPrincipal();

      expect(await screen.findByText(/Type a search or select from topics that appear in these documents\./)).toBeInTheDocument();
    });
  });

  describe("the documents filter", () => {
    it("counts the documents being searched", async () => {
      renderPrincipal();

      expect(await screen.findByRole("button", { name: "Documents in this Law (3)" })).toBeInTheDocument();
    });

    it("lists every document, all selected to begin with", async () => {
      renderPrincipal();

      const list = await openDocumentsFilter();

      const checkboxes = within(list).getAllByRole("checkbox");
      expect(checkboxes).toHaveLength(3);
      checkboxes.forEach((checkbox) => expect(checkbox).toBeChecked());
    });

    it("re-runs the search over the remaining documents when one is deselected", async () => {
      renderPrincipal({ q: "renewable" });
      await waitFor(() => expect(mockFetchSearchPassages).toHaveBeenCalledTimes(1));

      const list = await openDocumentsFilter();
      await userEvent.click(within(list).getByRole("checkbox", { name: /Amendment to the renewable energies law/ }));

      await waitFor(() =>
        expect(mockFetchSearchPassages).toHaveBeenLastCalledWith(expect.objectContaining({ documents: ["CCLW.document.1.1", "CCLW.document.1.3"] }))
      );
    });

    it("puts a narrowed selection in the url so it can be shared", async () => {
      renderPrincipal({ q: "renewable" });

      const list = await openDocumentsFilter();
      await userEvent.click(within(list).getByRole("checkbox", { name: /Decree on renewable energy sources/ }));

      await waitFor(() => expect(url.writes).toContainEqual({ key: "docs", value: ["CCLW.document.1.1", "CCLW.document.1.2"] }));
    });

    it("leaves the url clean when every document is selected again", async () => {
      renderPrincipal({ q: "renewable", docs: ["CCLW.document.1.1", "CCLW.document.1.2"] });

      const list = await openDocumentsFilter();
      await userEvent.click(within(list).getByRole("checkbox", { name: /Decree on renewable energy sources/ }));

      await waitFor(() => expect(url.writes.at(-1)).toEqual({ key: "docs", value: null }));
    });

    it("holds the last remaining document, as searching none returns nothing", async () => {
      renderPrincipal({ q: "renewable", docs: ["CCLW.document.1.2"] });
      await waitFor(() => expect(mockFetchSearchPassages).toHaveBeenCalledTimes(1));

      const list = await openDocumentsFilter();
      // Base UI renders the control as a span, so the disabled state is only in ARIA.
      const lastCheckbox = within(list).getByRole("checkbox", { name: /Amendment to the renewable energies law/ });
      expect(lastCheckbox).toHaveAttribute("aria-disabled", "true");

      await userEvent.click(lastCheckbox);

      expect(mockFetchSearchPassages).toHaveBeenCalledTimes(1);
      expect(url.writes).toHaveLength(0);
    });
  });

  describe("following a passage to its document", () => {
    it("opens the document page, carrying the search term over", async () => {
      renderPrincipal({ q: "renewable" });

      await userEvent.click(await screen.findByRole("button", { name: /Certain ecological/ }));

      await waitFor(() => expect(mockRouter.asPath).toBe("/documents/main-document?q=renewable"));
    });

    it("opens the document in a new tab from the footer link, carrying the search over", async () => {
      const open = vi.spyOn(window, "open").mockImplementation(() => null);
      renderPrincipal({ q: "renewable" });

      await userEvent.click(await screen.findByRole("button", { name: "View document" }));

      expect(open).toHaveBeenCalledWith("/documents/main-document?q=renewable", "_blank");
      open.mockRestore();
    });

    it("carries the topics over to the document page, on its own base params", async () => {
      renderPrincipal({ q: "renewable", filters: topicFilter });

      await userEvent.click(await screen.findByRole("button", { name: /Certain ecological/ }));

      await waitFor(() =>
        expect(mockRouter.asPath).toBe(`/documents/main-document?filters=${encodeURIComponent(JSON.stringify(topicFilter))}&q=renewable`)
      );
    });
  });

  describe("loading more results", () => {
    const pageOf = (ids: string[], total: number) => ({
      total_size: total,
      results: ids.map((id) => buildPassage({ id, text: `Passage ${id}` })),
    });

    it("starts at the first page", async () => {
      renderWithPreview({ q: "renewable" });

      await waitFor(() => expect(mockFetchSearchPassages).toHaveBeenCalledWith(expect.objectContaining({ pageToken: 1 })));
    });

    it("does not offer more when every result is already loaded", async () => {
      mockFetchSearchPassages.mockResolvedValue(pageOf(["a", "b"], 2));
      renderWithPreview({ q: "renewable" });

      await screen.findByText("Passage a");
      expect(screen.queryByRole("button", { name: /load more/i })).not.toBeInTheDocument();
    });

    it("offers more when the total exceeds what is loaded", async () => {
      mockFetchSearchPassages.mockResolvedValue(pageOf(["a", "b"], 5));
      renderWithPreview({ q: "renewable" });

      expect(await screen.findByRole("button", { name: /load more/i })).toBeInTheDocument();
      expect(screen.getByText("Showing 2 of 5")).toBeInTheDocument();
    });

    it("requests the next page and appends it below the first", async () => {
      mockFetchSearchPassages.mockResolvedValueOnce(pageOf(["a", "b"], 4)).mockResolvedValueOnce(pageOf(["c", "d"], 4));
      renderWithPreview({ q: "renewable" });

      await userEvent.click(await screen.findByRole("button", { name: /load more/i }));

      expect(await screen.findByText("Passage c")).toBeInTheDocument();
      expect(screen.getByText("Passage a")).toBeInTheDocument();
      expect(mockFetchSearchPassages).toHaveBeenLastCalledWith(expect.objectContaining({ pageToken: 2 }));
    });

    it("stops offering more once the last page has arrived", async () => {
      mockFetchSearchPassages.mockResolvedValueOnce(pageOf(["a", "b"], 4)).mockResolvedValueOnce(pageOf(["c", "d"], 4));
      renderWithPreview({ q: "renewable" });

      await userEvent.click(await screen.findByRole("button", { name: /load more/i }));

      await screen.findByText("Passage d");
      expect(screen.queryByRole("button", { name: /load more/i })).not.toBeInTheDocument();
    });

    it("stops offering more when a page comes back empty despite an over-reported total", async () => {
      mockFetchSearchPassages.mockResolvedValueOnce(pageOf(["a"], 99)).mockResolvedValueOnce(pageOf([], 99));
      renderWithPreview({ q: "renewable" });

      await userEvent.click(await screen.findByRole("button", { name: /load more/i }));

      await waitFor(() => expect(screen.queryByRole("button", { name: /load more/i })).not.toBeInTheDocument());
      // The results already on screen survive the empty page.
      expect(screen.getByText("Passage a")).toBeInTheDocument();
    });
  });
});

// Lets a search be left in flight so the intermediate render can be inspected.
function deferredPage() {
  let resolvePage: (value: unknown) => void;
  const promise = new Promise((resolve) => {
    resolvePage = resolve;
  });
  return { promise, resolve: (value: unknown) => resolvePage(value) };
}
