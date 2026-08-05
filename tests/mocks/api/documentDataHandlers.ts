import { http, HttpResponse } from "msw";

import { TApiDocumentPublic, TApiFamilyPublic } from "@/types";

export const testDocumentSlug = "test-document-slug";
export const testDocumentImportId = "document-1";

const testFamily = {
  category: "Executive",
  collections: [],
  concepts: [],
  corpus_id: "CCLW.corpus.i00000001.n0000",
  documents: [],
  events: [],
  geographies: ["FRA"],
  import_id: "family-1",
  last_updated_date: "2024-01-01",
  metadata: {},
  organisation: "CPR",
  organisation_attribution_url: null,
  published_date: "2024-01-01",
  slug: "test-family-slug",
  summary: "Test family summary",
  title: "Test Family",
} as TApiFamilyPublic;

export const testDocument = {
  cdn_object: "",
  content_type: null,
  document_role: null,
  document_type: null,
  family: testFamily,
  import_id: testDocumentImportId,
  language: null,
  languages: [],
  md5_sum: null,
  slug: testDocumentSlug,
  source_url: null,
  title: "Test Document",
  valid_metadata: {},
  variant_name: null,
  variant: null,
  document_status: "published",
} as TApiDocumentPublic;

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

export const documentByIdHandler = (overrides: Partial<{ status: number; document: Partial<TApiDocumentPublic> }> = {}) =>
  http.get(`${process.env.CONCEPTS_API_URL}/families/documents/${testDocumentImportId}`, () => {
    if (overrides.status && overrides.status !== 200) {
      return HttpResponse.json({ detail: "error" }, { status: overrides.status });
    }
    return HttpResponse.json({ data: { ...testDocument, ...overrides.document } });
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

export const dataInDocumentHandler = (overrides: Partial<{ status: number; body: unknown }> = {}) =>
  http.get(`${process.env.CONCEPTS_API_URL}/data-in/documents/${testDocumentImportId}`, () => {
    if (overrides.status && overrides.status !== 200) {
      return HttpResponse.json({ detail: "error" }, { status: overrides.status });
    }
    return HttpResponse.json({
      data: overrides.body ?? { id: testDocumentImportId, title: "Test Document", description: null, attributes: {}, labels: [] },
    });
  });
