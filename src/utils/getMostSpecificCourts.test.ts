import { TFamilyConcept, TFamilyMetadata } from "@/types";

import { getMostSpecificCourts, getMostSpecificCourtsFromMetadata, getMostSpecificCourtsFromWikiConcepts } from "./getMostSpecificCourts";

describe("getMostSpecificCourts", () => {
  it("should return the most specific court concept from hierarchy", () => {
    const concepts: TFamilyConcept[] = [
      {
        id: "Federal Courts",
        ids: [],
        type: "legal_entity",
        relation: "jurisdiction",
        preferred_label: "Federal Courts",
        subconcept_of_labels: [],
      },
      {
        id: "D.D.C.",
        ids: [],
        type: "legal_entity",
        relation: "jurisdiction",
        preferred_label: "D.D.C.",
        subconcept_of_labels: ["Federal Courts"],
      },
    ];

    const result = getMostSpecificCourts(concepts);
    expect(result).toHaveLength(1);
    expect(result[0].preferred_label).toBe("D.D.C.");
  });

  it("should return empty array when no legal entities found", () => {
    const concepts: TFamilyConcept[] = [
      {
        id: "Some Category",
        ids: [],
        type: "some_category",
        relation: "category",
        preferred_label: "Some Category",
        subconcept_of_labels: [],
      },
    ];

    const result = getMostSpecificCourts(concepts);
    expect(result).toEqual([]);
  });

  it("should return empty array when concepts array is empty", () => {
    const result = getMostSpecificCourts([]);
    expect(result).toEqual([]);
  });

  it("should handle multiple most specific courts", () => {
    const concepts: TFamilyConcept[] = [
      {
        id: "Federal Courts",
        ids: [],
        type: "legal_entity",
        relation: "jurisdiction",
        preferred_label: "Federal Courts",
        subconcept_of_labels: [],
      },
      {
        id: "D.D.C.",
        ids: [],
        type: "legal_entity",
        relation: "jurisdiction",
        preferred_label: "D.D.C.",
        subconcept_of_labels: ["Federal Courts"],
      },
      {
        id: "S.D.N.Y.",
        ids: [],
        type: "legal_entity",
        relation: "jurisdiction",
        preferred_label: "S.D.N.Y.",
        subconcept_of_labels: ["Federal Courts"],
      },
    ];

    const result = getMostSpecificCourts(concepts);
    expect(result).toHaveLength(2);
    expect(result.map((c) => c.preferred_label)).toContain("D.D.C.");
    expect(result.map((c) => c.preferred_label)).toContain("S.D.N.Y.");
  });
});

describe("getMostSpecificCourtsFromMetadata", () => {
  it("should extract the court name from metadata concept_preferred_label", () => {
    const metadata: TFamilyMetadata = {
      concept_preferred_label: ["Federal Courts", "D.D.C."],
    } as TFamilyMetadata;

    const result = getMostSpecificCourtsFromMetadata(metadata);
    expect(result).toBe("D.D.C.");
  });

  it("should return null when concept_preferred_label is empty", () => {
    const metadata: TFamilyMetadata = {
      concept_preferred_label: [],
    } as TFamilyMetadata;

    const result = getMostSpecificCourtsFromMetadata(metadata);
    expect(result).toBeNull();
  });

  it("should return null when concept_preferred_label is undefined", () => {
    const metadata: TFamilyMetadata = {} as TFamilyMetadata;

    const result = getMostSpecificCourtsFromMetadata(metadata);
    expect(result).toBeNull();
  });
});

describe("getMostSpecificCourtsFromWikiConcepts", () => {
  const createConcept = (
    overrides: Partial<{
      wikibase_id: string;
      preferred_label: string;
      type: string;
      has_subconcept: string[];
      subconcept_of: string[];
      recursive_subconcept_of: string[];
      alternative_labels: string[];
      negative_labels: string[];
      description: string;
      related_concepts: string[];
    }> = {}
  ) => ({
    wikibase_id: overrides.wikibase_id || "category/test",
    preferred_label: overrides.preferred_label || "Test Concept",
    type: overrides.type || "jurisdiction",
    has_subconcept: overrides.has_subconcept || [],
    subconcept_of: overrides.subconcept_of || [],
    recursive_subconcept_of: overrides.recursive_subconcept_of || [],
    alternative_labels: overrides.alternative_labels || [],
    negative_labels: overrides.negative_labels || [],
    description: overrides.description || "",
    related_concepts: overrides.related_concepts || [],
  });

  it("should return the preferred label when only one jurisdiction concept is provided", () => {
    const concepts = [
      createConcept({
        preferred_label: "D.D.C.",
        subconcept_of: ["Federal Courts"],
      }),
    ];
    expect(getMostSpecificCourtsFromWikiConcepts(concepts)).toBe("D.D.C.");
  });

  it("should return null when single concept has no preferred_label", () => {
    const concepts = [
      createConcept({
        preferred_label: undefined,
      }),
    ];
    expect(getMostSpecificCourtsFromWikiConcepts(concepts)).toBeNull();
  });

  it("should handle concepts with empty subconcept_of array", () => {
    const concepts = [
      createConcept({
        preferred_label: "Root Court",
        has_subconcept: [],
        subconcept_of: [],
      }),
    ];
    expect(getMostSpecificCourtsFromWikiConcepts(concepts)).toBeNull();
  });

  it("should return the first specific court when multiple leaf nodes exist", () => {
    const concepts = [
      createConcept({
        preferred_label: "D.D.C.",
        has_subconcept: [],
        subconcept_of: ["Federal Courts"],
      }),
      createConcept({
        preferred_label: "S.D.N.Y.",
        has_subconcept: [],
        subconcept_of: ["Federal Courts"],
      }),
    ];
    const result = getMostSpecificCourtsFromWikiConcepts(concepts);
    expect(result).toBe("D.D.C.");
  });

  it("should return the most specific court", () => {
    const concepts = [
      createConcept({
        preferred_label: "United States",
        has_subconcept: ["Federal Courts"],
        subconcept_of: [],
      }),
      createConcept({
        preferred_label: "Federal Courts",
        has_subconcept: ["D.D.C."],
        subconcept_of: ["United States"],
      }),
      createConcept({
        preferred_label: "D.D.C.",
        has_subconcept: [],
        subconcept_of: ["Federal Courts"],
      }),
    ];
    expect(getMostSpecificCourtsFromWikiConcepts(concepts)).toBe("D.D.C.");
  });
});
