import { describe, expect, it, vi } from "vitest";
import { IApiFamilyDocumentTopics, IDocumentLabelRelationship, IDocumentRelationship, ISearchDocument } from "@/types";

import { processSearchDocumentTopics } from "./processSearchDocumentTopics";

vi.mock("../fetchAndProcessTopics", () => ({
  fetchAndProcessTopics: vi.fn().mockResolvedValue({ rootTopics: [], topics: [] }),
}));
vi.mock("../conceptsGroupedbyRootConcept", () => ({
  groupByRootConcept: vi.fn().mockReturnValue({}),
}));

const conceptLabel = (id: string, count: number | null, documentId: string | null = null): IDocumentLabelRelationship => ({
  type: "concept",
  value: { id: `concept::${id}`, type: "concept", value: id },
  count,
  timestamp: null,
  document_id: documentId,
});

const nonConceptLabel = (type: string, id: string): IDocumentLabelRelationship => ({
  type,
  value: { id: `${type}::${id}`, type, value: id },
  count: null,
  timestamp: null,
  document_id: null,
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
    const testCases: {
      name: string;
      labels?: IDocumentLabelRelationship[];
      documents: IDocumentRelationship[];
      expected: IApiFamilyDocumentTopics["documents"];
    }[] = [
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
        name: "treats a has_version relation the same as has_member",
        documents: [
          {
            type: "has_version",
            value: {
              id: "CPR.document.i00000009.n0000",
              title: "Doc 9",
              description: null,
              labels: [],
              documents: [],
              items: [],
              attributes: { deprecated_slug: "doc-9" },
            },
          },
        ],
        expected: [{ importId: "CPR.document.i00000009.n0000", title: "Doc 9", slug: "doc-9", conceptCounts: {} }],
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
        name: "ignores any concept labels present on the nested document relation itself",
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
      {
        name: "derives conceptCounts from family-level labels matched by document_id",
        labels: [conceptLabel("Q1", 5, "CPR.document.i00000004.n0000")],
        documents: [
          {
            type: "has_member",
            value: {
              id: "CPR.document.i00000004.n0000",
              title: "Doc 4",
              description: null,
              labels: [],
              documents: [],
              items: [],
              attributes: { deprecated_slug: "doc-4" },
            },
          },
        ],
        expected: [{ importId: "CPR.document.i00000004.n0000", title: "Doc 4", slug: "doc-4", conceptCounts: { Q1: 5 } }],
      },
      {
        name: "attributes family-level labels to the matching document only, across multiple documents",
        labels: [
          conceptLabel("Q1", 5, "CPR.document.i00000005.n0000"),
          conceptLabel("Q2", 2, "CPR.document.i00000006.n0000"),
          conceptLabel("Q1", 1, null), // not attributed to any document (e.g. family-wide only)
        ],
        documents: [
          {
            type: "has_member",
            value: {
              id: "CPR.document.i00000005.n0000",
              title: "Doc 5",
              description: null,
              labels: [],
              documents: [],
              items: [],
              attributes: { deprecated_slug: "doc-5" },
            },
          },
          {
            type: "has_member",
            value: {
              id: "CPR.document.i00000006.n0000",
              title: "Doc 6",
              description: null,
              labels: [],
              documents: [],
              items: [],
              attributes: { deprecated_slug: "doc-6" },
            },
          },
        ],
        expected: [
          { importId: "CPR.document.i00000005.n0000", title: "Doc 5", slug: "doc-5", conceptCounts: { Q1: 5 } },
          { importId: "CPR.document.i00000006.n0000", title: "Doc 6", slug: "doc-6", conceptCounts: { Q2: 2 } },
        ],
      },
    ];

    it.each(testCases)("$name", async ({ labels, documents, expected }) => {
      const result = await processSearchDocumentTopics(makeFamilyDocument(labels ?? [], documents));

      expect(result.documents).toEqual(expected);
    });
  });
});
