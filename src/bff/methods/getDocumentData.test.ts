import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";

import { DEFAULT_FEATURES } from "@/constants/features";
import {
  dataInDocumentHandler,
  documentByIdHandler,
  documentSlugHandler,
  testDocumentImportId,
  testDocumentSlug,
  vespaDocumentHandler,
} from "@/tests/mocks/api/documentDataHandlers";
import { server } from "@/tests/mocks/server";

import { getDocumentData } from "./getDocumentData";

describe("getDocumentData", () => {
  it("returns document data on the happy path", async () => {
    server.use(documentSlugHandler(), documentByIdHandler(), vespaDocumentHandler());

    const result = await getDocumentData(testDocumentSlug, DEFAULT_FEATURES);

    expect(result.data).not.toBeNull();
  });

  it("returns null data when the slug lookup responds with a non-200 status", async () => {
    server.use(documentSlugHandler({ status: 404 }));

    const result = await getDocumentData(testDocumentSlug, DEFAULT_FEATURES);

    expect(result.data).toBeNull();
    expect(result.errors[0].message).toBe("Failed to query document slug");
  });

  it("returns null data when the slug lookup responds 200 with no family_document_import_id", async () => {
    server.use(
      documentSlugHandler({
        body: { name: testDocumentSlug, family_import_id: null, family_document_import_id: null, collection_import_id: null, created: "2024-01-01" },
      })
    );

    const result = await getDocumentData(testDocumentSlug, DEFAULT_FEATURES);

    expect(result.data).toBeNull();
    expect(result.errors[0].message).toBe("Failed to query document slug");
  });

  it("returns null data when the document-by-id lookup fails outright", async () => {
    server.use(
      documentSlugHandler(),
      http.get(`${process.env.CONCEPTS_API_URL}/families/documents/${testDocumentImportId}`, () => HttpResponse.error())
    );

    const result = await getDocumentData(testDocumentSlug, DEFAULT_FEATURES);

    expect(result.data).toBeNull();
    expect(result.errors[0].message).toBe("Failed to fetch document data");
  });

  it("fetches and validates the data-in document when new-data-model is enabled", async () => {
    server.use(documentSlugHandler(), documentByIdHandler(), vespaDocumentHandler(), dataInDocumentHandler());

    const result = await getDocumentData(testDocumentSlug, { ...DEFAULT_FEATURES, "new-data-model": true });

    expect(result.data).not.toBeNull();
  });

  it("logs an error but does not throw when the data-in fetch fails and new-data-model is enabled", async () => {
    server.use(documentSlugHandler(), documentByIdHandler(), vespaDocumentHandler(), dataInDocumentHandler({ status: 500 }));

    const result = await getDocumentData(testDocumentSlug, { ...DEFAULT_FEATURES, "new-data-model": true });

    expect(result.data).not.toBeNull();
  });

  it("logs an error but does not throw when the data-in response fails schema validation", async () => {
    server.use(documentSlugHandler(), documentByIdHandler(), vespaDocumentHandler(), dataInDocumentHandler({ body: { id: testDocumentImportId } }));

    const result = await getDocumentData(testDocumentSlug, { ...DEFAULT_FEATURES, "new-data-model": true });

    expect(result.data).not.toBeNull();
    expect(result.errors.length).toBeGreaterThan(0);
  });
});
