import { describe, expect, it } from "vitest";

import {
  dataInDocumentHandler,
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
    server.use(dataInDocumentHandler(), vespaDocumentHandler());

    const result = await getDocumentData(testDocumentSlug);

    expect(result.data).not.toBeNull();
    expect(result.data.document.import_id).toBe(testDocumentImportId);
  });

  it("returns null data when the document data-in fetch fails", async () => {
    server.use(dataInDocumentHandler({ status: 500 }));

    const result = await getDocumentData(testDocumentSlug);

    expect(result.data).toBeNull();
    expect(result.errors[0].message).toBe("Failed to fetch document data");
  });

  it("returns null data when the document data-in response fails schema validation", async () => {
    server.use(dataInDocumentHandler({ body: { id: testDocumentImportId } }));

    const result = await getDocumentData(testDocumentSlug);

    expect(result.data).toBeNull();
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("returns the document's family when present", async () => {
    server.use(
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
