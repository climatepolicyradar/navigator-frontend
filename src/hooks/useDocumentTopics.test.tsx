import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";

import { DocumentLabelRelationship, SearchDocument, SearchDocumentsResponse } from "@/api/search";

import { useDocumentTopics } from "./useDocumentTopics";

const mockFetchSearchDocuments = vi.hoisted(() => vi.fn());
vi.mock("@/api/search", () => ({
  fetchSearchDocuments: mockFetchSearchDocuments,
}));

const label = (id: string, value: string, type: string): DocumentLabelRelationship => ({
  count: null,
  type: "labels",
  value: { id, value, type },
  timestamp: null,
});

const searchDocument = (id: string, labels: DocumentLabelRelationship[]): SearchDocument =>
  ({
    id,
    title: id,
    description: null,
    labels,
    documents: [],
    items: [],
    attributes: {},
  }) as SearchDocument;

const searchResponse = (results: SearchDocument[]): SearchDocumentsResponse =>
  ({
    total_size: results.length,
    page: 1,
    page_size: results.length,
    total_pages: 1,
    next_page: null,
    previous_page: null,
    results,
  }) as SearchDocumentsResponse;

const renderUseDocumentTopics = (...args: Parameters<typeof useDocumentTopics>) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const wrapper = ({ children }: { children: React.ReactNode }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;

  return renderHook(() => useDocumentTopics(...args), { wrapper });
};

describe("useDocumentTopics", () => {
  beforeEach(() => {
    mockFetchSearchDocuments.mockReset();
    mockFetchSearchDocuments.mockResolvedValue(searchResponse([]));
  });

  it("asks search-api for the given documents, so the topics are scoped to them", async () => {
    renderUseDocumentTopics(["CCLW.executive.1.1", "CCLW.executive.2.2"]);

    await waitFor(() => expect(mockFetchSearchDocuments).toHaveBeenCalled());

    expect(mockFetchSearchDocuments.mock.calls[0][0]).toMatchObject({
      filters: {
        op: "and",
        filters: [
          {
            op: "or",
            filters: [
              { field: "id", op: "contains", value: "CCLW.executive.1.1" },
              { field: "id", op: "contains", value: "CCLW.executive.2.2" },
            ],
          },
        ],
      },
      // Every document asked for has to fit on the one page, or its topics go missing.
      page_size: "2",
    });
  });

  it("returns the documents' concepts as topics, keyed on the bare wikibase id", async () => {
    mockFetchSearchDocuments.mockResolvedValue(
      searchResponse([searchDocument("CCLW.executive.1.1", [label("concept::Q123", "Adaptation", "concept")])])
    );

    const { result } = renderUseDocumentTopics(["CCLW.executive.1.1"]);

    await waitFor(() => expect(result.current).toHaveLength(1));

    expect(result.current[0]).toMatchObject({
      wikibase_id: "Q123",
      preferred_label: "Adaptation",
    });
  });

  it("leaves out labels that are not concepts, as only concepts filter passages", async () => {
    mockFetchSearchDocuments.mockResolvedValue(
      searchResponse([
        searchDocument("CCLW.executive.1.1", [
          label("concept::Q123", "Adaptation", "concept"),
          label("status::Principal", "Principal", "status"),
          label("language::en", "English", "language"),
        ]),
      ])
    );

    const { result } = renderUseDocumentTopics(["CCLW.executive.1.1"]);

    await waitFor(() => expect(result.current).toHaveLength(1));

    expect(result.current.map((topic) => topic.wikibase_id)).toEqual(["Q123"]);
  });

  it("offers a concept once however many of the documents mention it", async () => {
    mockFetchSearchDocuments.mockResolvedValue(
      searchResponse([
        searchDocument("CCLW.executive.1.1", [label("concept::Q123", "Adaptation", "concept")]),
        searchDocument("CCLW.executive.2.2", [label("concept::Q123", "Adaptation", "concept"), label("concept::Q456", "Mitigation", "concept")]),
      ])
    );

    const { result } = renderUseDocumentTopics(["CCLW.executive.1.1", "CCLW.executive.2.2"]);

    await waitFor(() => expect(result.current).toHaveLength(2));

    expect(result.current.map((topic) => topic.wikibase_id)).toEqual(["Q123", "Q456"]);
  });

  it("does not search when there are no documents to search over", async () => {
    const { result } = renderUseDocumentTopics([]);

    await waitFor(() => expect(result.current).toEqual([]));

    expect(mockFetchSearchDocuments).not.toHaveBeenCalled();
  });

  it("does not search while disabled, so views that never show the filters cost nothing", async () => {
    const { result } = renderUseDocumentTopics(["CCLW.executive.1.1"], {
      enabled: false,
    });

    await waitFor(() => expect(result.current).toEqual([]));

    expect(mockFetchSearchDocuments).not.toHaveBeenCalled();
  });

  it("returns no topics until the search comes back", () => {
    const { result } = renderUseDocumentTopics(["CCLW.executive.1.1"]);

    expect(result.current).toEqual([]);
  });
});
