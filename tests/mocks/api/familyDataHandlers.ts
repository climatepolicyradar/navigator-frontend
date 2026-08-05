import { http, HttpResponse } from "msw";

import { TApiFamilyPublic } from "@/types";

export const testFamilyImportId = "family-1";
export const testFamilySlug = "test-family-slug";

export const testFamily = {
  category: "Executive",
  collections: [],
  concepts: [],
  corpus_id: "CCLW.corpus.i00000001.n0000",
  documents: [],
  events: [],
  geographies: ["FRA"],
  import_id: testFamilyImportId,
  last_updated_date: "2024-01-01",
  metadata: {},
  organisation: "CPR",
  organisation_attribution_url: null,
  published_date: "2024-01-01",
  slug: testFamilySlug,
  summary: "Test family summary",
  title: "Test Family",
} as TApiFamilyPublic;

export const familySlugHandler = (overrides: Partial<{ status: number; body: unknown }> = {}) =>
  http.get(`${process.env.CONCEPTS_API_URL}/families/slugs/${testFamilySlug}`, () => {
    if (overrides.status && overrides.status !== 200) {
      return HttpResponse.json(overrides.body ?? { detail: "Not Found" }, { status: overrides.status });
    }
    return HttpResponse.json({
      data: overrides.body ?? {
        name: testFamilySlug,
        family_import_id: testFamilyImportId,
        family_document_import_id: null,
        collection_import_id: null,
        created: "2024-01-01",
      },
    });
  });

export const familyByIdHandler = (overrides: Partial<{ status: number; family: Partial<TApiFamilyPublic> }> = {}) =>
  http.get(`${process.env.CONCEPTS_API_URL}/families/${testFamilyImportId}`, () => {
    if (overrides.status && overrides.status !== 200) {
      return HttpResponse.json({ detail: "error" }, { status: overrides.status });
    }
    return HttpResponse.json({ data: { ...testFamily, ...overrides.family } });
  });

export const familyCollectionHandler = () =>
  http.get(`${process.env.CONCEPTS_API_URL}/families/collections/:collectionId`, () => {
    return HttpResponse.json({ data: [] });
  });

export const geographySubdivisionsHandler = () =>
  http.get(`${process.env.CONCEPTS_API_URL}/geographies/subdivisions/:country`, () => {
    return HttpResponse.json([]);
  });

export const vespaFamilyHandler = () =>
  http.get(`${process.env.BACKEND_API_URL}/families/${testFamilyImportId}`, () => {
    return HttpResponse.json({
      hits: 0,
      total_family_hits: 0,
      query_time_ms: 1,
      total_time_ms: 1,
      continuation_token: null,
      this_continuation_token: "",
      prev_continuation_token: null,
      families: [],
    });
  });

export const dataInFamilyHandler = (overrides: Partial<{ status: number; body: unknown }> = {}) =>
  http.get(`${process.env.CONCEPTS_API_URL}/data-in/documents/${testFamilyImportId}`, () => {
    if (overrides.status && overrides.status !== 200) {
      return HttpResponse.json({ detail: "error" }, { status: overrides.status });
    }
    return HttpResponse.json({
      data: overrides.body ?? { id: testFamilyImportId, title: "Test Family", description: null, attributes: {}, labels: [] },
    });
  });
