import { describe, expect, it } from "vitest";

import { dataInCollectionHandler, testCollectionImportId } from "@/tests/mocks/api/collectionDataHandlers";
import {
  dataInFamilyHandler,
  familySlugHandler,
  testFamilyDataIn,
  testFamilyImportId,
  testFamilySlug,
  vespaFamilyHandler,
} from "@/tests/mocks/api/familyDataHandlers";
import { server } from "@/tests/mocks/server";

import { getFamilyData } from "./getFamilyData";

describe("getFamilyData", () => {
  it("returns family data on the happy path", async () => {
    server.use(familySlugHandler(), dataInFamilyHandler(), vespaFamilyHandler());

    const result = await getFamilyData(testFamilySlug);

    expect(result.errors.map((e) => e.message)).toEqual([]);
    expect(result.data).not.toBeNull();
    expect(result.data.family.import_id).toBe(testFamilyImportId);
  });

  it("returns null data when the slug lookup responds with a non-200 status", async () => {
    server.use(familySlugHandler({ status: 404 }));

    const result = await getFamilyData(testFamilySlug);

    expect(result.data).toBeNull();
    expect(result.errors[0].message).toBe("Failed to query family slug");
  });

  it("returns null data when the slug lookup responds 200 with no family_import_id", async () => {
    server.use(
      familySlugHandler({
        body: { name: testFamilySlug, family_import_id: null, family_document_import_id: null, collection_import_id: null, created: "2024-01-01" },
      })
    );

    const result = await getFamilyData(testFamilySlug);

    expect(result.data).toBeNull();
    expect(result.errors[0].message).toBe("Failed to query family slug");
  });

  it("returns null data when the family data-in fetch fails", async () => {
    server.use(familySlugHandler(), dataInFamilyHandler({ status: 500 }));

    const result = await getFamilyData(testFamilySlug);

    expect(result.data).toBeNull();
    expect(result.errors[0].message).toBe("Failed to fetch family data");
  });

  it("returns null data when the family data-in response fails schema validation", async () => {
    server.use(familySlugHandler(), dataInFamilyHandler({ body: { id: testFamilyImportId } }));

    const result = await getFamilyData(testFamilySlug);

    expect(result.data).toBeNull();
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("skips the slug lookup and uses importId directly when provided", async () => {
    server.use(dataInFamilyHandler(), vespaFamilyHandler());

    const result = await getFamilyData("", testFamilyImportId);

    expect(result.data).not.toBeNull();
    expect(result.data.family.import_id).toBe(testFamilyImportId);
  });

  it("fetches and validates a parent collection's data-in document", async () => {
    server.use(
      familySlugHandler(),
      dataInFamilyHandler({
        body: {
          ...testFamilyDataIn,
          documents: [
            {
              type: "member_of",
              value: {
                id: testCollectionImportId,
                title: "Test Collection",
                description: null,
                attributes: { deprecated_slug: "test-collection-slug" },
                labels: [],
              },
            },
          ],
        },
      }),
      dataInCollectionHandler(),
      vespaFamilyHandler()
    );

    const result = await getFamilyData(testFamilySlug);

    expect(result.data.collections).toHaveLength(1);
    expect(result.data.collections[0].import_id).toBe(testCollectionImportId);
  });

  it("returns null data when a parent collection's data-in fetch fails", async () => {
    server.use(
      familySlugHandler(),
      dataInFamilyHandler({
        body: {
          ...testFamilyDataIn,
          documents: [
            {
              type: "member_of",
              value: {
                id: testCollectionImportId,
                title: "Test Collection",
                description: null,
                attributes: { deprecated_slug: "test-collection-slug" },
                labels: [],
              },
            },
          ],
        },
      }),
      dataInCollectionHandler({ status: 500 })
    );

    const result = await getFamilyData(testFamilySlug);

    expect(result.data).toBeNull();
    expect(result.errors[0].message).toBe("Failed to fetch collections data");
  });
});
