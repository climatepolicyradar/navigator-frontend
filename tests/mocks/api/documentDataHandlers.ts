import { http, HttpResponse } from "msw";

import { TDataInDocument } from "@/schemas";

import { testFamilyDataIn } from "./familyDataHandlers";

export const testDocumentSlug = "test-document-slug";
export const testDocumentImportId = "document-1";

// getDocumentData fetches the document's own search record from `/search/documents/${document.id}`
// (see src/bff/methods/getDocumentData.ts) to derive its topics - not a vespa/family endpoint.
export const searchDocumentHandler = () =>
  http.get(`${process.env.CONCEPTS_API_URL}/search/documents/${testDocumentImportId}`, () => {
    return HttpResponse.json({
      data: {
        id: testDocumentImportId,
        title: "Test Document",
        description: null,
        labels: [],
        documents: [],
        items: [],
        attributes: {},
      },
    });
  });

// A minimal but schema-complete TDataInDocument for a document: satisfies validateDocumentAttributes
// (status, deprecated_slug), the mandatory "category" label, and the mandatory cdn item
// required by transformDocument (MANDATORY_ITEM_TYPES applies whenever status isn't "awaiting_source_file").
// The member_of relation is required too: documentTransformer treats a document without a parent family as not found.
export const testDocumentDataIn: TDataInDocument = {
  id: testDocumentImportId,
  title: "Test Document",
  description: null,
  attributes: { status: "published", deprecated_slug: testDocumentSlug },
  labels: [{ type: "category", value: { id: "category::policy", type: "category", value: "Policy", labels: [] } }],
  items: [
    { type: "cdn", url: "https://cdn.example.com/test-document.pdf", content_type: "application/pdf" },
    { type: "source", url: "https://example.com/test-document", content_type: null },
  ],
  documents: [{ type: "member_of", value: testFamilyDataIn }],
};

export const dataInDocumentHandler = (overrides: Partial<{ status: number; body: unknown }> = {}) =>
  http.get(`${process.env.CONCEPTS_API_URL}/data-in/documents/slug/${testDocumentSlug}`, () => {
    if (overrides.status && overrides.status !== 200) {
      return HttpResponse.json({ detail: "error" }, { status: overrides.status });
    }
    return HttpResponse.json({
      data: overrides.body ?? testDocumentDataIn,
    });
  });
