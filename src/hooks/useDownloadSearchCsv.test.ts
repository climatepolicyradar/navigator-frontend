import { act, renderHook, waitFor } from "@testing-library/react";

import { configureDocumentsFilters } from "@/api/search";
import { DEFAULT_THEME_CONFIG } from "@/constants/themeConfig";
import { TLabelCategoryValue, TSearchQueryGroup, TThemeConfig } from "@/types";
import { inflateFilters } from "@/utils/filters/deflate";

import { buildDownloadSearchCsvUrl, useDownloadSearchCsv } from "./useDownloadSearchCsv";

const themeConfigWithCategories = (searchCategories: TLabelCategoryValue[]): TThemeConfig => ({
  ...DEFAULT_THEME_CONFIG,
  searchCategories,
});

const NO_CATEGORIES = themeConfigWithCategories([]);

describe("buildDownloadSearchCsvUrl", () => {
  const originalEnv = process.env.NEXT_PUBLIC_API_URL;

  afterEach(() => {
    // Assigning `undefined` to a process.env key coerces it to the string "undefined",
    // so an originally-unset var must be deleted, not reassigned.
    if (originalEnv === undefined) {
      delete process.env.NEXT_PUBLIC_API_URL;
    } else {
      process.env.NEXT_PUBLIC_API_URL = originalEnv;
    }
  });

  it("builds the download endpoint with query, order_by, and max_results", () => {
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.org";

    const url = buildDownloadSearchCsvUrl({
      query: "flood risk",
      themeConfig: NO_CATEGORIES,
      sort: "relevance",
    });

    expect(url.origin + url.pathname).toBe("https://api.example.org/search/documents:download");
    expect(url.searchParams.get("query")).toBe("flood risk");
    expect(url.searchParams.get("order_by")).toBe("relevance desc");
    expect(url.searchParams.get("max_results")).toBe("500");
  });

  it("maps every sort key to its order_by clause", () => {
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.org";

    expect(
      buildDownloadSearchCsvUrl({
        themeConfig: NO_CATEGORIES,
        sort: "recent",
      }).searchParams.get("order_by")
    ).toBe("attributes.published_date desc");
    expect(
      buildDownloadSearchCsvUrl({
        themeConfig: NO_CATEGORIES,
        sort: "oldest",
      }).searchParams.get("order_by")
    ).toBe("attributes.published_date asc");
    expect(
      buildDownloadSearchCsvUrl({
        themeConfig: NO_CATEGORIES,
        sort: "title_asc",
      }).searchParams.get("order_by")
    ).toBe("title asc");
    expect(
      buildDownloadSearchCsvUrl({
        themeConfig: NO_CATEGORIES,
        sort: "title_desc",
      }).searchParams.get("order_by")
    ).toBe("title desc");
  });

  it("omits query when not provided", () => {
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.org";

    const url = buildDownloadSearchCsvUrl({
      themeConfig: NO_CATEGORIES,
      sort: "relevance",
    });

    expect(url.searchParams.has("query")).toBe(false);
  });

  it("includes filters, restricted to principal documents, when given a non-empty filter tree", () => {
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.org";

    const url = buildDownloadSearchCsvUrl({
      themeConfig: NO_CATEGORIES,
      sort: "relevance",
      filters: {
        op: "and",
        filters: [{ field: "attributes.status", op: "contains", value: "published" }],
      },
    });

    expect(url.searchParams.get("encoding")).toBe("deflate");
    const filters = JSON.parse(inflateFilters(url.searchParams.get("filters") ?? ""));
    expect(filters.op).toBe("and");
    // The caller's tree sits alongside the always-on principal rule, under the
    // default published-date bounds that configureDocumentsFilters adds.
    expect(filters.filters).toContainEqual({
      op: "and",
      filters: [
        {
          field: "labels.value.id",
          op: "contains",
          value: "status::Principal",
        },
        {
          op: "and",
          filters: [{ field: "attributes.status", op: "contains", value: "published" }],
        },
      ],
    });
  });

  it("omits the caller's empty filter tree, keeping only the always-on principal filter", () => {
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.org";

    const url = buildDownloadSearchCsvUrl({
      themeConfig: NO_CATEGORIES,
      sort: "relevance",
      filters: {
        op: "and",
        filters: [{ field: "type", op: "contains", value: "" }],
      },
    });

    const filters = JSON.parse(inflateFilters(url.searchParams.get("filters") ?? ""));
    expect(filters.filters).toContainEqual({
      op: "and",
      filters: [
        {
          field: "labels.value.id",
          op: "contains",
          value: "status::Principal",
        },
      ],
    });
  });

  it("restricts the download to the theme's search categories, so CCC only gets litigation", () => {
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.org";

    const url = buildDownloadSearchCsvUrl({
      query: "bananas",
      themeConfig: themeConfigWithCategories(["Litigation"]),
      sort: "relevance",
    });

    const filters = JSON.parse(inflateFilters(url.searchParams.get("filters") ?? ""));
    expect(filters.filters).toContainEqual({
      op: "or",
      filters: [
        {
          op: "contains",
          field: "labels.value.id",
          value: "category::Litigation",
        },
      ],
    });
  });

  it("does not restrict categories when the theme has none", () => {
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.org";

    const url = buildDownloadSearchCsvUrl({
      themeConfig: NO_CATEGORIES,
      sort: "relevance",
    });

    expect(inflateFilters(url.searchParams.get("filters") ?? "")).not.toContain("category::");
  });

  it("applies the same default filters as the results list, so the download matches what is on screen", () => {
    vi.useFakeTimers({ toFake: ["Date"], now: new Date("2026-01-01T00:00:00.000Z") });

    onTestFinished(() => {
      vi.useRealTimers();
    });

    process.env.NEXT_PUBLIC_API_URL = "https://api.example.org";
    const themeConfig = themeConfigWithCategories(["Litigation"]);

    const filters: TSearchQueryGroup = {
      op: "and",
      filters: [{ field: "attributes.status", op: "contains", value: "published" }],
    };

    const downloadFilters = JSON.parse(
      inflateFilters(
        buildDownloadSearchCsvUrl({
          query: "bananas",
          themeConfig,
          filters,
          sort: "relevance",
        }).searchParams.get("filters") ?? ""
      )
    );
    const listFilters = configureDocumentsFilters(
      {
        op: "and",
        filters: [
          {
            field: "labels.value.id",
            op: "contains",
            value: "status::Principal",
          },
          filters,
        ],
      },
      themeConfig.searchCategories
    );

    expect(downloadFilters).toEqual(JSON.parse(JSON.stringify(listFilters)));
  });

  it("falls back to the default API origin when NEXT_PUBLIC_API_URL is unset", () => {
    delete process.env.NEXT_PUBLIC_API_URL;

    const url = buildDownloadSearchCsvUrl({
      themeConfig: NO_CATEGORIES,
      sort: "relevance",
    });

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
    const blob = new Blob(["document_id,title\n1,Climate Act\n"], {
      type: "text/csv",
    });
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
      result.current.download({
        query: "flood",
        themeConfig: NO_CATEGORIES,
        sort: "relevance",
      });
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
      result.current.download({
        query: "flood",
        themeConfig: NO_CATEGORIES,
        sort: "relevance",
      });
    });

    await waitFor(() => expect(result.current.status).toBe("error"));
  });

  it("goes to error status when fetch rejects", async () => {
    vi.spyOn(global, "fetch").mockRejectedValue(new Error("network down"));

    const { result } = renderHook(() => useDownloadSearchCsv());

    act(() => {
      result.current.download({
        query: "flood",
        themeConfig: NO_CATEGORIES,
        sort: "relevance",
      });
    });

    await waitFor(() => expect(result.current.status).toBe("error"));
  });

  it("resetStatus returns to idle", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(new Response("", { status: 500 }));
    const { result } = renderHook(() => useDownloadSearchCsv());

    act(() => {
      result.current.download({
        query: "flood",
        themeConfig: NO_CATEGORIES,
        sort: "relevance",
      });
    });
    await waitFor(() => expect(result.current.status).toBe("error"));

    act(() => result.current.resetStatus());

    expect(result.current.status).toBe("idle");
  });
});
