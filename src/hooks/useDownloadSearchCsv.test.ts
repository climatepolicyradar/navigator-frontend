import { act, renderHook, waitFor } from "@testing-library/react";

import { buildDownloadSearchCsvUrl, useDownloadSearchCsv } from "./useDownloadSearchCsv";

describe("buildDownloadSearchCsvUrl", () => {
  const originalEnv = process.env.NEXT_PUBLIC_API_URL;

  afterEach(() => {
    process.env.NEXT_PUBLIC_API_URL = originalEnv;
  });

  it("builds the download endpoint with query, order_by, and max_results", () => {
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.org";

    const url = buildDownloadSearchCsvUrl({ query: "flood risk", sort: "relevance" });

    expect(url.origin + url.pathname).toBe("https://api.example.org/search/documents:download");
    expect(url.searchParams.get("query")).toBe("flood risk");
    expect(url.searchParams.get("order_by")).toBe("relevance desc");
    expect(url.searchParams.get("max_results")).toBe("500");
  });

  it("maps every sort key to its order_by clause", () => {
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.org";

    expect(buildDownloadSearchCsvUrl({ sort: "recent" }).searchParams.get("order_by")).toBe("attributes.published_date desc");
    expect(buildDownloadSearchCsvUrl({ sort: "oldest" }).searchParams.get("order_by")).toBe("attributes.published_date asc");
    expect(buildDownloadSearchCsvUrl({ sort: "title_asc" }).searchParams.get("order_by")).toBe("title asc");
    expect(buildDownloadSearchCsvUrl({ sort: "title_desc" }).searchParams.get("order_by")).toBe("title desc");
  });

  it("omits query when not provided", () => {
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.org";

    const url = buildDownloadSearchCsvUrl({ sort: "relevance" });

    expect(url.searchParams.has("query")).toBe(false);
  });

  it("includes filters, restricted to principal documents, when given a non-empty filter tree", () => {
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.org";

    const url = buildDownloadSearchCsvUrl({
      sort: "relevance",
      filters: { op: "and", filters: [{ field: "attributes.status", op: "contains", value: "published" }] },
    });

    const filters = JSON.parse(url.searchParams.get("filters") ?? "{}");
    expect(filters.op).toBe("and");
    expect(filters.filters).toHaveLength(2);
    expect(filters.filters[0]).toEqual({
      op: "and",
      filters: [{ field: "labels.value.id", op: "contains", value: "status::Principal" }],
    });
  });

  it("omits the caller's empty filter tree, keeping only the always-on principal filter", () => {
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.org";

    const url = buildDownloadSearchCsvUrl({
      sort: "relevance",
      filters: { op: "and", filters: [{ field: "type", op: "contains", value: "" }] },
    });

    const filters = JSON.parse(url.searchParams.get("filters") ?? "{}");
    expect(filters).toEqual({
      op: "and",
      filters: [{ field: "labels.value.id", op: "contains", value: "status::Principal" }],
    });
  });

  it("falls back to the default API origin when NEXT_PUBLIC_API_URL is unset", () => {
    delete process.env.NEXT_PUBLIC_API_URL;

    const url = buildDownloadSearchCsvUrl({ sort: "relevance" });

    expect(url.origin).toBe("https://api.climatepolicyradar.org");
  });
});

describe("useDownloadSearchCsv", () => {
  const originalCreateObjectURL = window.URL.createObjectURL;
  const originalRevokeObjectURL = window.URL.revokeObjectURL;

  beforeEach(() => {
    window.URL.createObjectURL = vi.fn(() => "blob:mock-url");
    window.URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    window.URL.createObjectURL = originalCreateObjectURL;
    window.URL.revokeObjectURL = originalRevokeObjectURL;
    vi.restoreAllMocks();
  });

  it("starts idle", () => {
    const { result } = renderHook(() => useDownloadSearchCsv());

    expect(result.current.status).toBe("idle");
  });

  it("goes loading then success on a 200 response, and triggers a blob download", async () => {
    const blob = new Blob(["document_id,title\n1,Climate Act\n"], { type: "text/csv" });
    vi.spyOn(global, "fetch").mockResolvedValue(new Response(blob, { status: 200 }));
    const clickSpy = vi.fn();
    const realCreateElement = document.createElement.bind(document);
    const createElementSpy = vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
      const el = realCreateElement(tag);
      if (tag === "a") el.click = clickSpy;
      return el;
    });

    const { result } = renderHook(() => useDownloadSearchCsv());

    act(() => {
      result.current.download({ query: "flood", sort: "relevance" });
    });
    expect(result.current.status).toBe("loading");

    await waitFor(() => expect(result.current.status).toBe("success"));

    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(window.URL.createObjectURL).toHaveBeenCalledTimes(1);
    createElementSpy.mockRestore();
  });

  it("goes to error status when the response is not ok", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(new Response("", { status: 500 }));

    const { result } = renderHook(() => useDownloadSearchCsv());

    act(() => {
      result.current.download({ query: "flood", sort: "relevance" });
    });

    await waitFor(() => expect(result.current.status).toBe("error"));
  });

  it("goes to error status when fetch rejects", async () => {
    vi.spyOn(global, "fetch").mockRejectedValue(new Error("network down"));

    const { result } = renderHook(() => useDownloadSearchCsv());

    act(() => {
      result.current.download({ query: "flood", sort: "relevance" });
    });

    await waitFor(() => expect(result.current.status).toBe("error"));
  });

  it("resetStatus returns to idle", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(new Response("", { status: 500 }));
    const { result } = renderHook(() => useDownloadSearchCsv());

    act(() => {
      result.current.download({ query: "flood", sort: "relevance" });
    });
    await waitFor(() => expect(result.current.status).toBe("error"));

    act(() => result.current.resetStatus());

    expect(result.current.status).toBe("idle");
  });
});
