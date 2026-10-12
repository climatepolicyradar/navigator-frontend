import { TSearchQueryGroup } from "@/types";

import { fetchSearchPassages } from "./passages";

const requestedFilters = (): TSearchQueryGroup => {
  const url = vi.mocked(global.fetch).mock.calls[0][0] as URL;
  return JSON.parse(url.searchParams.get("filters") ?? "{}");
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

  it("scopes to the given documents", async () => {
    await fetchSearchPassages({ query: "", documents: ["CCLW.doc.1.0", "CCLW.doc.2.0"], principalId: "CCLW.family.1.0" });

    expect(requestedFilters().filters).toContainEqual({
      op: "or",
      filters: [
        { field: "document_id", op: "contains", value: "CCLW.doc.1.0" },
        { field: "document_id", op: "contains", value: "CCLW.doc.2.0" },
      ],
    });
  });

  // The defect behind FUS-683: a family whose documents are all deleted produces an empty `or`
  // group, which the API treats as "no constraint" rather than "match nothing", so the search
  // escapes to the whole corpus. Falling back to the principal keeps the scope on the family.
  it("scopes to the principal when there are no documents to enumerate", async () => {
    await fetchSearchPassages({ query: "", documents: [], principalId: "UNFCCC.family.824.0", filters: topicFilter });

    expect(requestedFilters()).toEqual({
      op: "and",
      filters: [{ op: "or", filters: [{ field: "principal_id", op: "contains", value: "UNFCCC.family.824.0" }] }, topicFilter],
    });
  });

  it("never sends an empty scope group, which the API would drop", async () => {
    await fetchSearchPassages({ query: "", documents: [], principalId: "UNFCCC.family.824.0", filters: topicFilter });

    const scopeGroups = requestedFilters().filters.filter((filter) => "filters" in filter && filter.filters.length === 0);
    expect(scopeGroups).toEqual([]);
  });

  // Without a document or a principal there is nothing to scope to. Searching anyway would run
  // over the whole corpus, so the request is refused rather than silently widened.
  it("refuses to search when there is neither a document nor a principal to scope to", async () => {
    await expect(fetchSearchPassages({ query: "", documents: [], filters: topicFilter })).rejects.toThrow(/scope/i);

    expect(global.fetch).not.toHaveBeenCalled();
  });
});
