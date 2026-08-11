import { describe, expect, it } from "vitest";

import {
  dataInDocumentHandler,
  documentSlugHandler,
  testDocumentDataIn,
  testDocumentImportId,
  testDocumentSlug,
  vespaDocumentHandler,
} from "@/tests/mocks/api/documentDataHandlers";
import { testFamilyDataIn, testFamilyImportId } from "@/tests/mocks/api/familyDataHandlers";
import { server } from "@/tests/mocks/server";

import { getDocumentData } from "./getDocumentData";

describe("getDocumentData", () => {
  it("returns document data on the happy path", async () => {
    server.use(documentSlugHandler(), dataInDocumentHandler(), vespaDocumentHandler());

    const result = await getDocumentData(testDocumentSlug);

    expect(result.data).not.toBeNull();
    expect(result.data.document.import_id).toBe(testDocumentImportId);
  });

  it("returns null data when the slug lookup responds with a non-200 status", async () => {
    server.use(documentSlugHandler({ status: 404 }));

    const result = await getDocumentData(testDocumentSlug);

    expect(result.data).toBeNull();
    expect(result.errors[0].message).toBe("Failed to query document slug");
  });

  it("returns null data when the slug lookup responds 200 with no family_document_import_id", async () => {
    server.use(
      documentSlugHandler({
        body: { name: testDocumentSlug, family_import_id: null, family_document_import_id: null, collection_import_id: null, created: "2024-01-01" },
      })
    );

    const result = await getDocumentData(testDocumentSlug);

    expect(result.data).toBeNull();
    expect(result.errors[0].message).toBe("Failed to query document slug");
  });

  it("returns null data when the document data-in fetch fails", async () => {
    server.use(documentSlugHandler(), dataInDocumentHandler({ status: 500 }));

    const result = await getDocumentData(testDocumentSlug);

    expect(result.data).toBeNull();
    expect(result.errors[0].message).toBe("Failed to fetch document data");
  });

  it("returns null data when the document data-in response fails schema validation", async () => {
    server.use(documentSlugHandler(), dataInDocumentHandler({ body: { id: testDocumentImportId } }));

    const result = await getDocumentData(testDocumentSlug);

    expect(result.data).toBeNull();
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("returns the document's family when present", async () => {
    server.use(
      documentSlugHandler(),
      dataInDocumentHandler({
        body: {
          ...testDocumentDataIn,
          documents: [{ type: "member_of", value: testFamilyDataIn }],
        },
      }),
      vespaDocumentHandler()
    );

    const result = await getDocumentData(testDocumentSlug);

    expect(result.data.family).not.toBeNull();
    expect(result.data.family.import_id).toBe(testFamilyImportId);
  });
});
