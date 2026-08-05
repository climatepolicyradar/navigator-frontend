import { describe, expect, it } from "vitest";

import { DEFAULT_FEATURES } from "@/constants/features";
import { collectionByIdHandler, collectionSlugHandler, dataInCollectionHandler, testCollectionSlug } from "@/tests/mocks/api/collectionDataHandlers";
import { server } from "@/tests/mocks/server";

import { getCollectionData } from "./getCollectionData";

describe("getCollectionData", () => {
  it("returns collection data on the happy path", async () => {
    server.use(collectionSlugHandler(), collectionByIdHandler());

    const result = await getCollectionData(testCollectionSlug, DEFAULT_FEATURES);

    expect(result.data).not.toBeNull();
  });

  it("returns null data when the slug lookup responds with a non-200 status", async () => {
    server.use(collectionSlugHandler({ status: 404 }));

    const result = await getCollectionData(testCollectionSlug, DEFAULT_FEATURES);

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

    const result = await getCollectionData(testCollectionSlug, DEFAULT_FEATURES);

    expect(result.data).toBeNull();
    expect(result.errors[0].message).toBe("Failed to query collection slug");
  });

  it("does not throw when the data-in fetch fails and new-data-model is enabled", async () => {
    server.use(collectionSlugHandler(), collectionByIdHandler(), dataInCollectionHandler({ status: 500 }));

    const result = await getCollectionData(testCollectionSlug, { ...DEFAULT_FEATURES, "new-data-model": true });

    expect(result.data).not.toBeNull();
  });
});
