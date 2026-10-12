import { describe, expect, it } from "vitest";

import {
  collectionSlugHandler,
  dataInChildFamilyHandler,
  dataInCollectionHandler,
  testChildFamilyImportId,
  testCollectionSlug,
} from "@/tests/mocks/api/collectionDataHandlers";
import { server } from "@/tests/mocks/server";

import { getCollectionData } from "./getCollectionData";

describe("getCollectionData", () => {
  it("returns collection data on the happy path", async () => {
    server.use(collectionSlugHandler(), dataInCollectionHandler());

    const result = await getCollectionData(testCollectionSlug);

    expect(result.data).not.toBeNull();
  });

  it("returns null data when the slug lookup responds with a non-200 status", async () => {
    server.use(collectionSlugHandler({ status: 404 }));

    const result = await getCollectionData(testCollectionSlug);

    expect(result.data).toBeNull();
    expect(result.errors[0].message).toBe("Failed to query collection slug");
  });

  it("returns null data when the slug lookup responds 200 with no collection_import_id", async () => {
    server.use(
      collectionSlugHandler({
        body: {
          name: testCollectionSlug,
          family_import_id: null,
          family_document_import_id: null,
          collection_import_id: null,
          created: "2024-01-01",
        },
      })
    );

    const result = await getCollectionData(testCollectionSlug);

    expect(result.data).toBeNull();
    expect(result.errors[0].message).toBe("Failed to query collection slug");
  });

  it("returns null data when the collection data-in fetch fails", async () => {
    server.use(collectionSlugHandler(), dataInCollectionHandler({ status: 500 }));

    const result = await getCollectionData(testCollectionSlug);

    expect(result.data).toBeNull();
    expect(result.errors[0].message).toBe("Failed to fetch collection data");
  });

  it("fetches and validates each child family's data-in document", async () => {
    server.use(
      collectionSlugHandler(),
      dataInCollectionHandler({
        body: {
          id: "collection-1",
          title: "Test Collection",
          description: null,
          attributes: { deprecated_slug: "test-collection-slug" },
          labels: [],
          items: [],
          documents: [
            { type: "has_member", value: { id: testChildFamilyImportId, title: "Child Family", description: null, attributes: {}, labels: [] } },
          ],
        },
      }),
      dataInChildFamilyHandler()
    );

    const result = await getCollectionData(testCollectionSlug);

    expect(result.errors).toEqual([]);
    expect(result.data.collection.families).toHaveLength(1);
    expect(result.data.collection.families[0].import_id).toBe(testChildFamilyImportId);
  });

  it("returns null data when a child family's data-in fetch fails", async () => {
    server.use(
      collectionSlugHandler(),
      dataInCollectionHandler({
        body: {
          id: "collection-1",
          title: "Test Collection",
          description: null,
          attributes: { deprecated_slug: "test-collection-slug" },
          labels: [],
          items: [],
          documents: [
            { type: "has_member", value: { id: testChildFamilyImportId, title: "Child Family", description: null, attributes: {}, labels: [] } },
          ],
        },
      }),
      dataInChildFamilyHandler({ status: 500 })
    );

    const result = await getCollectionData(testCollectionSlug);

    expect(result.data).toBeNull();
    expect(result.errors[0].message).toBe("Failed to fetch families data");
  });
});
