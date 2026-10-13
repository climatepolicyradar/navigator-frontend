import { describe, expect, it, vi } from "vitest";
import { IApiFamilyDocumentTopics, IDocumentLabelRelationship, IDocumentRelationship, ISearchDocument } from "@/types";

import { processSearchDocumentTopics } from "./processSearchDocumentTopics";

vi.mock("../fetchAndProcessTopics", () => ({
  fetchAndProcessTopics: vi.fn().mockResolvedValue({ rootTopics: [], topics: [] }),
}));
vi.mock("../conceptsGroupedbyRootConcept", () => ({
  groupByRootConcept: vi.fn().mockReturnValue({}),
}));

const conceptLabel = (id: string, count: number | null): IDocumentLabelRelationship => ({
  type: "concept",
  value: { id: `concept::${id}`, type: "concept", value: id },
  count,
  timestamp: null,
});

const nonConceptLabel = (type: string, id: string): IDocumentLabelRelationship => ({
  type,
  value: { id: `${type}::${id}`, type, value: id },
  count: null,
  timestamp: null,
});

const makeFamilyDocument = (labels: ISearchDocument["labels"], documents: ISearchDocument["documents"] = []): ISearchDocument => ({
  id: "CPR.family.i00000001.n0000",
  title: "Test Family",
  description: null,
  labels,
  documents,
  items: [],
  attributes: {},
});

describe("processSearchDocumentTopics", () => {
  describe("aggregate conceptCounts built from the family's own labels", () => {
    const testCases = [
      { name: "no labels", labels: [], expected: {} },
      { name: "ignores non-concept labels", labels: [nonConceptLabel("category", "Corporate Disclosure")], expected: {} },
      { name: "a single concept label", labels: [conceptLabel("Q1", 5)], expected: { Q1: 5 } },
      { name: "repeated concept ids are summed", labels: [conceptLabel("Q1", 5), conceptLabel("Q1", 3)], expected: { Q1: 8 } },
      { name: "a null count is treated as 0", labels: [conceptLabel("Q1", null)], expected: { Q1: 0 } },
      {
        name: "multiple distinct concepts, with non-concept labels ignored",
        labels: [conceptLabel("Q1", 1), nonConceptLabel("geography", "CHN"), conceptLabel("Q2", 2)],
        expected: { Q1: 1, Q2: 2 },
      },
    ];

    it.each(testCases)("$name", async ({ labels, expected }) => {
      const result = await processSearchDocumentTopics(makeFamilyDocument(labels));

      expect(result.conceptCounts).toEqual(expected);
    });
  });

  describe("per-document entries", () => {
    const testCases: { name: string; documents: IDocumentRelationship[]; expected: IApiFamilyDocumentTopics["documents"] }[] = [
      {
        name: "maps importId, title and slug from the nested document relation",
        documents: [
          {
            type: "has_member",
            value: {
              id: "CPR.document.i00000001.n0000",
              title: "Doc 1",
              description: null,
              labels: [],
              documents: [],
              items: [],
              attributes: { deprecated_slug: "doc-1" },
            },
          },
        ],
        expected: [{ importId: "CPR.document.i00000001.n0000", title: "Doc 1", slug: "doc-1", conceptCounts: {} }],
      },
      {
        name: "falls back to an empty slug when deprecated_slug is missing",
        documents: [
          {
            type: "has_member",
            value: { id: "CPR.document.i00000002.n0000", title: "Doc 2", description: null, labels: [], documents: [], items: [], attributes: {} },
          },
        ],
        expected: [{ importId: "CPR.document.i00000002.n0000", title: "Doc 2", slug: "", conceptCounts: {} }],
      },
      {
        name: "ignores any concept labels present on the nested document relation",
        documents: [
          {
            type: "has_member",
            value: {
              id: "CPR.document.i00000003.n0000",
              title: "Doc 3",
              description: null,
              labels: [conceptLabel("Q1", 5)],
              documents: [],
              items: [],
              attributes: { deprecated_slug: "doc-3" },
            },
          },
        ],
        expected: [{ importId: "CPR.document.i00000003.n0000", title: "Doc 3", slug: "doc-3", conceptCounts: {} }],
      },
    ];

    it.each(testCases)("$name", async ({ documents, expected }) => {
      const result = await processSearchDocumentTopics(makeFamilyDocument([], documents));

      expect(result.documents).toEqual(expected);
    });
  });
});
