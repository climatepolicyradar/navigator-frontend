import { TFamilyConcept, TFamilyMetadata } from "@/types";

import { getMostSpecificCourts, getMostSpecificCourtsFromMetadata } from "./getMostSpecificCourts";

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
