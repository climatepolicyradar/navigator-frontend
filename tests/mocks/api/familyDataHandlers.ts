import { http, HttpResponse } from "msw";

import { TDataInDocument } from "@/schemas";

export const testFamilyImportId = "family-1";
export const testFamilySlug = "test-family-slug";

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

// A minimal but schema-complete TDataInDocument for a family: satisfies validateFamilyAttributes
// (deprecated_slug, published_date) and the activity_status/category/provider labels required by
// transformFamily's downstream pipeline (transformAttribution, groupByType's mandatory-type check).
export const testFamilyDataIn: TDataInDocument = {
  id: testFamilyImportId,
  title: "Test Family",
  description: null,
  attributes: { deprecated_slug: testFamilySlug, published_date: "2024-01-01" },
  labels: [
    { type: "activity_status", value: { id: "activity_status::published", type: "concept", value: "Published", labels: [] } },
    { type: "category", value: { id: "category::policy", type: "concept", value: "Policy", labels: [] } },
    {
      type: "provider",
      value: { id: "provider::cpr", type: "agent", value: "CPR", labels: [], attributes: {} },
    },
  ],
};

export const dataInFamilyHandler = (overrides: Partial<{ status: number; body: unknown }> = {}) =>
  http.get(`${process.env.CONCEPTS_API_URL}/data-in/documents/${testFamilyImportId}`, () => {
    if (overrides.status && overrides.status !== 200) {
      return HttpResponse.json({ detail: "error" }, { status: overrides.status });
    }
    return HttpResponse.json({
      data: overrides.body ?? testFamilyDataIn,
    });
  });
