import { describe, expect, it } from "vitest";

import { dataInCollectionHandler, testCollectionImportId } from "@/tests/mocks/api/collectionDataHandlers";
import {
  dataInFamilyHandler,
  searchDocumentsHandler,
  testFamilyDataIn,
  testFamilyImportId,
  testFamilySlug,
} from "@/tests/mocks/api/familyDataHandlers";
import { taxonomyHandler } from "@/tests/mocks/api/taxonomyHandlers";
import { server } from "@/tests/mocks/server";

import { getFamilyData } from "./getFamilyData";

describe("getFamilyData", () => {
  it("returns family data on the happy path", async () => {
    server.use(dataInFamilyHandler(), searchDocumentsHandler());

    const result = await getFamilyData(testFamilySlug);

    expect(result.errors.map((e) => e.message)).toEqual([]);
    expect(result.data).not.toBeNull();
    expect(result.data.family.import_id).toBe(testFamilyImportId);
  });

  it("returns null data when the family data-in fetch fails", async () => {
    server.use(dataInFamilyHandler({ status: 500 }));

    const result = await getFamilyData(testFamilySlug);

    expect(result.data).toBeNull();
    expect(result.errors[0].message).toBe("Failed to fetch family data");
  });

  it("returns null data when the family data-in response fails schema validation", async () => {
    server.use(dataInFamilyHandler({ body: { id: testFamilyImportId } }));

    const result = await getFamilyData(testFamilySlug);

    expect(result.data).toBeNull();
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("fetches and validates a parent collection's data-in document", async () => {
    server.use(
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
      searchDocumentsHandler()
    );

    const result = await getFamilyData(testFamilySlug);

    expect(result.data.collections).toHaveLength(1);
    expect(result.data.collections[0].import_id).toBe(testCollectionImportId);
  });

  // @related LITIGATION_PLACEHOLDER
  it("returns family data when a child document is a placeholder with no source item", async () => {
    server.use(
      dataInFamilyHandler({
        body: {
          ...testFamilyDataIn,
          documents: [
            {
              type: "has_member",
              value: {
                id: "document-placeholder",
                title: "",
                description: null,
                attributes: { status: "published", deprecated_slug: "_placeholder" },
                labels: [{ type: "category", value: { id: "category::litigation", type: "concept", value: "Litigation", labels: [] } }],
                items: [{ type: "cdn", url: "https://cdn.example.com/navigator/None", content_type: null }],
              },
            },
          ],
        },
      }),
      searchDocumentsHandler()
    );

    const result = await getFamilyData(testFamilySlug);

    expect(result.errors.map((e) => e.message)).toEqual([]);
    expect(result.data).not.toBeNull();
    expect(result.data.family.documents).toHaveLength(1);
    expect(result.data.family.documents[0].source_url).toBe("");
  });

  it("returns null data when a parent collection's data-in fetch fails", async () => {
    server.use(
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

  it("keeps only the taxonomy branches the family's documents are tagged with", async () => {
    server.use(
      dataInFamilyHandler(),
      searchDocumentsHandler(),
      taxonomyHandler({
        body: [
          {
            id: "concept::Q1",
            type: "concept",
            value: "root",
            count: 0,
            children: [
              { id: "concept::Q10", type: "concept", value: "tagged", count: 2, children: [] },
              { id: "concept::Q11", type: "concept", value: "untagged", count: 0, children: [] },
            ],
          },
          { id: "concept::Q2", type: "concept", value: "untagged root", count: 0, children: [] },
        ],
      })
    );

    const result = await getFamilyData(testFamilySlug);

    expect(result.data.familyTopics.topics.map((root) => [root.id, root.children.map((child) => child.id)])).toEqual([
      ["concept::Q1", ["concept::Q10"]],
    ]);
  });

  it("returns no topics when nothing in the taxonomy is tagged", async () => {
    server.use(
      dataInFamilyHandler(),
      searchDocumentsHandler(),
      taxonomyHandler({ body: [{ id: "concept::Q1", type: "concept", value: "root", count: 0, children: [] }] })
    );

    const result = await getFamilyData(testFamilySlug);

    expect(result.data.familyTopics.topics).toEqual([]);
  });
});
