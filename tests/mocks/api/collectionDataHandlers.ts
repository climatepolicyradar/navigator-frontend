import { http, HttpResponse } from "msw";

import { TDataInDocument } from "@/schemas";

export const testCollectionSlug = "test-collection-slug";
export const testCollectionImportId = "collection-1";

export const testChildFamilyImportId = "family-in-collection-1";

const testCollectionDataIn: TDataInDocument = {
  id: testCollectionImportId,
  title: "Test Collection",
  description: null,
  attributes: { deprecated_slug: testCollectionSlug },
  labels: [],
  items: [],
  documents: [],
};

export const dataInCollectionHandler = (overrides: Partial<{ status: number; body: unknown }> = {}) =>
  http.get(`${process.env.CONCEPTS_API_URL}/data-in/documents/slug/${testCollectionSlug}`, () => {
    if (overrides.status && overrides.status !== 200) {
      return HttpResponse.json({ detail: "error" }, { status: overrides.status });
    }
    return HttpResponse.json({
      data: overrides.body ?? testCollectionDataIn,
    });
  });

// getFamilyData resolves a family's parent collection by import id, not by slug
export const dataInParentCollectionHandler = (overrides: Partial<{ status: number; body: unknown }> = {}) =>
  http.get(`${process.env.CONCEPTS_API_URL}/data-in/documents/${testCollectionImportId}`, () => {
    if (overrides.status && overrides.status !== 200) {
      return HttpResponse.json({ detail: "error" }, { status: overrides.status });
    }
    return HttpResponse.json({
      data: overrides.body ?? testCollectionDataIn,
    });
  });

// A minimal but schema-complete TDataInDocument for a family: satisfies validateFamilyAttributes
// (deprecated_slug, published_date) and the activity_status/category/provider labels required by
// transformFamily's downstream pipeline (transformAttribution, groupByType's mandatory-type check).
export const testChildFamilyDataIn: TDataInDocument = {
  id: testChildFamilyImportId,
  title: "Child Family",
  description: null,
  attributes: { deprecated_slug: "child-family-slug", published_date: "2024-01-01" },
  labels: [
    { type: "activity_status", value: { id: "activity_status::published", type: "concept", value: "Published", labels: [] } },
    { type: "category", value: { id: "category::policy", type: "concept", value: "Policy", labels: [] } },
    {
      type: "provider",
      value: { id: "provider::cpr", type: "agent", value: "CPR", labels: [], attributes: {} },
    },
  ],
};

export const dataInChildFamilyHandler = (overrides: Partial<{ status: number; body: unknown }> = {}) =>
  http.get(`${process.env.CONCEPTS_API_URL}/data-in/documents/${testChildFamilyImportId}`, () => {
    if (overrides.status && overrides.status !== 200) {
      return HttpResponse.json({ detail: "error" }, { status: overrides.status });
    }
    return HttpResponse.json({ data: overrides.body ?? testChildFamilyDataIn });
  });
