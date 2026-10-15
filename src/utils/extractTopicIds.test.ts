import { describe, expect, it } from "vitest";

import { IDocumentLabelRelationship, ISearchDocument, ISearchDocumentResponse } from "@/types";

import { extractTopicIds } from "./extractTopicIds";

const conceptLabel = (id: string): IDocumentLabelRelationship => ({
  type: "concept",
  value: { id: `concept::${id}`, type: "concept", value: id },
  count: 1,
  timestamp: null,
});

const nonConceptLabel = (type: string, id: string): IDocumentLabelRelationship => ({
  type,
  value: { id: `${type}::${id}`, type, value: id },
  count: null,
  timestamp: null,
});

const makeResponse = (labels: ISearchDocument["labels"]): ISearchDocumentResponse => ({
  data: {
    id: "CPR.document.i00000001.n0000",
    title: "Test Document",
    description: null,
    labels,
    documents: [],
    items: [],
    attributes: {},
  },
});

describe("extractTopicIds", () => {
  it("returns the wikibase ids of concept labels, ignoring non-concept labels and de-duplicating", () => {
    const response = makeResponse([conceptLabel("Q1"), nonConceptLabel("category", "Corporate Disclosure"), conceptLabel("Q2"), conceptLabel("Q1")]);

    expect(extractTopicIds(response)).toEqual(["Q1", "Q2"]);
  });

  it("returns an empty array when there are no concept labels", () => {
    const response = makeResponse([nonConceptLabel("category", "Corporate Disclosure")]);

    expect(extractTopicIds(response)).toEqual([]);
  });
});
