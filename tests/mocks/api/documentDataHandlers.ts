import { http, HttpResponse } from "msw";

import { TDataInDocument } from "@/schemas";

export const testDocumentSlug = "test-document-slug";
export const testDocumentImportId = "document-1";

export const documentSlugHandler = (overrides: Partial<{ status: number; body: unknown }> = {}) =>
  http.get(`${process.env.CONCEPTS_API_URL}/families/slugs/${testDocumentSlug}`, () => {
    if (overrides.status && overrides.status !== 200) {
      return HttpResponse.json(overrides.body ?? { detail: "Not Found" }, { status: overrides.status });
    }
    return HttpResponse.json({
      data: overrides.body ?? {
        name: testDocumentSlug,
        family_import_id: null,
        family_document_import_id: testDocumentImportId,
        collection_import_id: null,
        created: "2024-01-01",
      },
    });
  });

export const vespaDocumentHandler = () =>
  http.get(`${process.env.BACKEND_API_URL}/document/${testDocumentImportId}`, () => {
    return HttpResponse.json(
      {
        hits: 0,
        total_family_hits: 0,
        query_time_ms: 1,
        total_time_ms: 1,
        continuation_token: null,
        this_continuation_token: "",
        prev_continuation_token: null,
        families: [],
      },
      { status: 200 }
    );
  });

// A minimal but schema-complete TDataInDocument for a document: satisfies validateDocumentAttributes
// (status, deprecated_slug), the mandatory "category" label, and the mandatory cdn/source items
// required by transformDocument (MANDATORY_ITEM_TYPES applies whenever status isn't "awaiting_source_file").
export const testDocumentDataIn: TDataInDocument = {
  id: testDocumentImportId,
  title: "Test Document",
  description: null,
  attributes: { status: "published", deprecated_slug: testDocumentSlug },
  labels: [{ type: "category", value: { id: "category::policy", type: "concept", value: "Policy", labels: [] } }],
  items: [
    { type: "cdn", url: "https://cdn.example.com/test-document.pdf", content_type: "application/pdf" },
    { type: "source", url: "https://example.com/test-document", content_type: null },
  ],
};

export const dataInDocumentHandler = (overrides: Partial<{ status: number; body: unknown }> = {}) =>
  http.get(`${process.env.CONCEPTS_API_URL}/data-in/documents/${testDocumentImportId}`, () => {
    if (overrides.status && overrides.status !== 200) {
      return HttpResponse.json({ detail: "error" }, { status: overrides.status });
    }
    return HttpResponse.json({
      data: overrides.body ?? testDocumentDataIn,
    });
  });
