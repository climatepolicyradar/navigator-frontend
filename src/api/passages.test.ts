import { TSearchQueryGroup } from "@/types";
import { inflateFilters } from "@/utils/filters/deflate";

import { fetchSearchPassages } from "./passages";

const TEST_API_URL = "https://api.climatepolicyradar.org";

const requestedUrl = (): URL => vi.mocked(global.fetch).mock.calls[0][0] as URL;

const requestedDocumentIds = (): string[] => requestedUrl().searchParams.getAll("document_id");

const requestedFilters = (): TSearchQueryGroup => {
  const url = requestedUrl();
  return JSON.parse(inflateFilters(url.searchParams.get("filters") ?? ""));
};

const topicFilter: TSearchQueryGroup = {
  op: "or",
  filters: [{ field: "labels.value.id", op: "contains", value: "concept::Q226" }],
};

describe("fetchSearchPassages", () => {
  beforeEach(() => {
    vi.spyOn(global, "fetch").mockResolvedValue({ ok: true, json: async () => ({}) } as Response);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("searches within the given documents", async () => {
    await fetchSearchPassages({
      apiUrl: TEST_API_URL,
      query: "",
      scope: { kind: "documents", documentIds: ["CCLW.doc.1.0", "CCLW.doc.2.0"] },
    });

    expect(requestedUrl().pathname).toBe("/search/passages:within");
    expect(requestedDocumentIds()).toEqual(["CCLW.doc.1.0", "CCLW.doc.2.0"]);
  });

  it("searches within a principal by its id", async () => {
    await fetchSearchPassages({
      apiUrl: TEST_API_URL,
      query: "",
      scope: { kind: "principal", principalId: "UNFCCC.family.824.0" },
      filters: topicFilter,
    });

    expect(requestedDocumentIds()).toEqual(["UNFCCC.family.824.0"]);
  });

  it("sends the filters deflated", async () => {
    await fetchSearchPassages({
      apiUrl: TEST_API_URL,
      query: "",
      scope: { kind: "documents", documentIds: ["CCLW.doc.1.0"] },
      filters: topicFilter,
    });

    expect(requestedUrl().searchParams.get("encoding")).toBe("deflate");
    expect(requestedFilters()).toEqual(topicFilter);
  });

  it("requires a share of the query terms to match", async () => {
    await fetchSearchPassages({
      apiUrl: TEST_API_URL,
      query: "adaptation",
      scope: { kind: "documents", documentIds: ["CCLW.doc.1.0"] },
    });

    expect(requestedUrl().searchParams.get("msm")).toBe("0.7");
  });

  it("omits the query and msm when there is no query", async () => {
    await fetchSearchPassages({
      apiUrl: TEST_API_URL,
      query: "",
      scope: { kind: "documents", documentIds: ["CCLW.doc.1.0"] },
      filters: topicFilter,
    });

    expect(requestedUrl().searchParams.has("query")).toBe(false);
    expect(requestedUrl().searchParams.has("msm")).toBe(false);
  });

  it("omits the filters and their encoding when there are none", async () => {
    await fetchSearchPassages({
      apiUrl: TEST_API_URL,
      query: "adaptation",
      scope: { kind: "documents", documentIds: ["CCLW.doc.1.0"] },
    });

    expect(requestedUrl().searchParams.has("filters")).toBe(false);
    expect(requestedUrl().searchParams.has("encoding")).toBe(false);
  });
});
