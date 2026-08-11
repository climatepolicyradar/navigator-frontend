import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";

import { DEFAULT_FEATURES } from "@/constants/features";
import {
  dataInFamilyHandler,
  familyByIdHandler,
  familyCollectionHandler,
  familySlugHandler,
  geographySubdivisionsHandler,
  testFamilyImportId,
  testFamilySlug,
  vespaFamilyHandler,
} from "@/tests/mocks/api/familyDataHandlers";
import { server } from "@/tests/mocks/server";

import { getFamilyData } from "./getFamilyData";

describe("getFamilyData", () => {
  it("returns family data on the happy path", async () => {
    server.use(familySlugHandler(), familyByIdHandler(), familyCollectionHandler(), geographySubdivisionsHandler(), vespaFamilyHandler());

    const result = await getFamilyData(testFamilySlug, DEFAULT_FEATURES);

    expect(result.errors.map((e) => e.message)).toEqual([]);
    expect(result.data).not.toBeNull();
    expect(result.data.family.import_id).toBe(testFamilyImportId);
  });

  it("returns null data when the slug lookup responds with a non-200 status", async () => {
    server.use(familySlugHandler({ status: 404 }));

    const result = await getFamilyData(testFamilySlug, DEFAULT_FEATURES);

    expect(result.data).toBeNull();
    expect(result.errors[0].message).toBe("Failed to query family slug");
  });

  it("returns null data when the slug lookup responds 200 with no family_import_id", async () => {
    server.use(
      familySlugHandler({
        body: { name: testFamilySlug, family_import_id: null, family_document_import_id: null, collection_import_id: null, created: "2024-01-01" },
      })
    );

    const result = await getFamilyData(testFamilySlug, DEFAULT_FEATURES);

    expect(result.data).toBeNull();
    expect(result.errors[0].message).toBe("Failed to query family slug");
  });

  it("logs an error but does not throw when the family response is missing geographies", async () => {
    server.use(
      familySlugHandler(),
      familyByIdHandler({ family: { geographies: undefined } }),
      familyCollectionHandler(),
      geographySubdivisionsHandler(),
      vespaFamilyHandler()
    );

    const result = await getFamilyData(testFamilySlug, DEFAULT_FEATURES);

    expect(result.data).not.toBeNull();
    expect(result.errors.some((error) => error.message === "Family data missing geographies array")).toBe(true);
  });

  it("logs an error but does not throw when the family response is missing collections", async () => {
    server.use(
      familySlugHandler(),
      familyByIdHandler({ family: { collections: undefined } }),
      familyCollectionHandler(),
      geographySubdivisionsHandler(),
      vespaFamilyHandler()
    );

    const result = await getFamilyData(testFamilySlug, DEFAULT_FEATURES);

    expect(result.data).not.toBeNull();
    expect(result.errors.some((error) => error.message === "Family data missing collections array")).toBe(true);
  });

  it("skips the slug lookup and uses importId directly when provided", async () => {
    server.use(familyByIdHandler(), familyCollectionHandler(), geographySubdivisionsHandler(), vespaFamilyHandler());

    const result = await getFamilyData("", DEFAULT_FEATURES, testFamilyImportId);

    expect(result.data).not.toBeNull();
    expect(result.data.family.import_id).toBe(testFamilyImportId);
  });

  it("returns null data when the families-by-id lookup fails outright", async () => {
    server.use(
      familySlugHandler(),
      http.get(`${process.env.CONCEPTS_API_URL}/families/${testFamilyImportId}`, () => HttpResponse.error())
    );

    const result = await getFamilyData(testFamilySlug, DEFAULT_FEATURES);

    expect(result.data).toBeNull();
    expect(result.errors[0].message).toBe("Failed to fetch families data");
  });

  it("fetches and validates the data-in document when new-data-model is enabled", async () => {
    server.use(
      familySlugHandler(),
      familyByIdHandler(),
      familyCollectionHandler(),
      geographySubdivisionsHandler(),
      vespaFamilyHandler(),
      dataInFamilyHandler()
    );

    const result = await getFamilyData(testFamilySlug, { ...DEFAULT_FEATURES, "new-data-model": true });

    // The data-in fetch and schema validation should succeed without pushing a fetch-failure
    // error; downstream transformer errors (e.g. missing taxonomy items) are a separate concern.
    expect(result.errors.some((e) => e.message.includes("data-in") || e.message.includes("Failed to fetch"))).toBe(false);
    expect(result.data).not.toBeNull();
  });

  it("logs an error but does not throw when the data-in fetch fails and new-data-model is enabled", async () => {
    server.use(
      familySlugHandler(),
      familyByIdHandler(),
      familyCollectionHandler(),
      geographySubdivisionsHandler(),
      vespaFamilyHandler(),
      dataInFamilyHandler({ status: 500 })
    );

    const result = await getFamilyData(testFamilySlug, { ...DEFAULT_FEATURES, "new-data-model": true });

    expect(result.data).not.toBeNull();
  });

  it("logs an error but does not throw when the data-in response fails schema validation", async () => {
    server.use(
      familySlugHandler(),
      familyByIdHandler(),
      familyCollectionHandler(),
      geographySubdivisionsHandler(),
      vespaFamilyHandler(),
      dataInFamilyHandler({ body: { id: testFamilyImportId } })
    );

    const result = await getFamilyData(testFamilySlug, { ...DEFAULT_FEATURES, "new-data-model": true });

    expect(result.data).not.toBeNull();
    expect(result.errors.length).toBeGreaterThan(0);
  });
});
