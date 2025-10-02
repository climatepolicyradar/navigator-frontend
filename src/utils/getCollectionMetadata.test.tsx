import { describe, it, expect } from "vitest";

import { EN_DASH } from "@/constants/chars";
import { TCollectionPublicWithFamilies } from "@/types";
import { containsStringInReactNode } from "@/utils/test-utils/containsStringInReactNode";

import { getCollectionMetadata } from "./getCollectionMetadata";

// Mock dependencies
vi.mock("@/utils/buildConceptHierarchy", () => ({
  buildConceptHierarchy: (concepts: any[]) => concepts,
}));
vi.mock("@/components/molecules/conceptHierarchy/ConceptHierarchy", () => ({
  ConceptHierarchy: ({ concept }: any) => <span>{concept.label}</span>,
}));

const baseCollection: TCollectionPublicWithFamilies = {
  import_id: "collection-1",
  title: "Test Collection",
  description: "Test Description",
  families: [
    {
      category: "Litigation",
      corpus_id: "",
      geographies: ["USA"],
      import_id: "",
      last_updated_date: null,
      metadata: {
        status: ["Example status."],
      },
      organisation: "",
      published_date: null,
      slug: "",
      summary: "",
      title: "",
      collections: [],
      concepts: [],
      corpus: {
        import_id: "Academic.corpus.Litigation.n0000",
        title: "Litigation",
        corpus_type_name: "Litigation",
        organisation: {
          name: "Sabin",
          id: 11,
        },
        attribution_url: "climatecasechart.com",
      },
      documents: [],
      events: [],
      organisation_attribution_url: null,
    },
  ],
  metadata: {},
  slug: "test-collection",
};

describe("getCollectionMetadata", () => {
  it("returns earliest filing date from events", () => {
    const collection = baseCollection;
    collection.families[0].events = [
      { title: "Filing Date", date: "2020-01-01", event_type: "Filing", status: "Active", import_id: "event-1", metadata: {} },
      { title: "Filing Date", date: "2019-01-01", event_type: "Filing", status: "Active", import_id: "event-2", metadata: {} },
    ];
    const result = getCollectionMetadata(collection);
    expect(result[0].label).toBe("Filing date");
    expect(result[0].value).toBe(2019);
  });

  it("returns EN_DASH if no date is present", () => {
    const collection = baseCollection;
    collection.families[0].events = [{ title: "Filing Date", date: "", event_type: "Filing", status: "Active", import_id: "event-1", metadata: {} }];
    const result = getCollectionMetadata(collection);
    expect(result[0].label).toBe("Filing date");
    expect(result[0].value).toBe(EN_DASH);
  });

  it("returns EN_DASH if no events are present", () => {
    const collection = baseCollection;
    collection.families[0].events = [];
    const result = getCollectionMetadata(collection);
    expect(result[0].label).toBe("Filing date");
    expect(result[0].value).toBe(EN_DASH);
  });

  it("returns status from first family metadata", () => {
    const result = getCollectionMetadata(baseCollection);
    expect(result[1].label).toBe("Status");
    expect(result[1].value).toBe("Example status.");
  });

  it("returns EN_DASH if status is missing", () => {
    const collection = {
      ...baseCollection,
      families: [{ ...baseCollection.families[0], metadata: {} }],
    };
    const result = getCollectionMetadata(collection);
    expect(result[1].label).toBe("Status");
    expect(result[1].value).toBe(EN_DASH);
  });

  it("returns collection description for 'At issue'", () => {
    const result = getCollectionMetadata(baseCollection);
    expect(result[2].label).toBe("At issue");
    expect(result[2].value).toBe("Test Description");
  });

  it("renders case categories and principal laws", () => {
    const concepts = [
      { id: "1", ids: [], type: "legal_category", preferred_label: "Category A", relation: "category", subconcept_of_labels: [] },
      { id: "2", ids: [], type: "law", preferred_label: "Law X", relation: "principal_law", subconcept_of_labels: [] },
    ];
    const collection = {
      ...baseCollection,
      families: [{ ...baseCollection.families[0], concepts }],
    };
    const result = getCollectionMetadata(collection);
    expect(result[3].label).toContain("Case category");
    expect(result[4].label).toContain("Principal law");
    containsStringInReactNode(result[3].value, "Category A");
    containsStringInReactNode(result[4].value, "Law X");
  });

  it("renders EN_DASH if no case categories or laws", () => {
    const collection = {
      ...baseCollection,
      families: [{ ...baseCollection.families[0], concepts: [] }],
    };
    const result = getCollectionMetadata(collection);
    expect(containsStringInReactNode(result[3].value, EN_DASH)).toBe(true);
    expect(containsStringInReactNode(result[4].value, EN_DASH)).toBe(true);
  });

  it("handles missing families gracefully", () => {
    const collection = { ...baseCollection, families: [] };
    const result = getCollectionMetadata(collection);
    expect(containsStringInReactNode(result[0].value, EN_DASH)).toBe(true);
    expect(containsStringInReactNode(result[1].value, EN_DASH)).toBe(true);
    expect(containsStringInReactNode(result[2].value, "Test Description")).toBe(true);
    expect(containsStringInReactNode(result[3].value, EN_DASH)).toBe(true);
    expect(containsStringInReactNode(result[4].value, EN_DASH)).toBe(true);
  });
});
