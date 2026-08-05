import { http, HttpResponse } from "msw";

import { TApiCollectionPublicWithFamilies } from "@/types";

export const testCollectionSlug = "test-collection-slug";
export const testCollectionImportId = "collection-1";

export const testCollection = {
  description: "Test collection",
  families: [],
  import_id: testCollectionImportId,
  metadata: {},
  slug: testCollectionSlug,
  title: "Test Collection",
} as TApiCollectionPublicWithFamilies;

export const collectionSlugHandler = (overrides: Partial<{ status: number; body: unknown }> = {}) =>
  http.get(`${process.env.CONCEPTS_API_URL}/families/slugs/${testCollectionSlug}`, () => {
    if (overrides.status && overrides.status !== 200) {
      return HttpResponse.json(overrides.body ?? { detail: "Not Found" }, { status: overrides.status });
    }
    return HttpResponse.json({
      data: overrides.body ?? {
        name: testCollectionSlug,
        family_import_id: null,
        family_document_import_id: null,
        collection_import_id: testCollectionImportId,
        created: "2024-01-01",
      },
    });
  });

export const collectionByIdHandler = (overrides: Partial<{ status: number; collection: Partial<TApiCollectionPublicWithFamilies> }> = {}) =>
  http.get(`${process.env.CONCEPTS_API_URL}/families/collections/${testCollectionImportId}`, () => {
    if (overrides.status && overrides.status !== 200) {
      return HttpResponse.json({ detail: "error" }, { status: overrides.status });
    }
    return HttpResponse.json({ data: { ...testCollection, ...overrides.collection } });
  });

export const dataInCollectionHandler = (overrides: Partial<{ status: number }> = {}) =>
  http.get(`${process.env.CONCEPTS_API_URL}/data-in/documents/${testCollectionImportId}`, () => {
    if (overrides.status && overrides.status !== 200) {
      return HttpResponse.json({ detail: "error" }, { status: overrides.status });
    }
    return HttpResponse.json({ data: { id: testCollectionImportId, attributes: {}, labels: [], items: [], documents: [] } });
  });
