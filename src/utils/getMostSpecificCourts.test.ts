import { TFamilyConcept, TFamilyMetadata } from "@/types";

import { getMostSpecificCourts, getMostSpecificCourtsFromMetadata } from "./getMostSpecificCourts";

describe("getMostSpecificCourts", () => {
  it("should extract the court name from concepts hierarchy", () => {
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
    expect(result).toBe("D.D.C.");
  });

  it("should return null when no legal entities found", () => {
    const concepts: TFamilyConcept[] = [
      {
        id: "Some Category",
        ids: [],
        type: "legal_category",
        relation: "category",
        preferred_label: "Some Category",
        subconcept_of_labels: [],
      },
    ];

    const result = getMostSpecificCourts(concepts);
    expect(result).toBeNull();
  });

  it("should return null when concepts array is empty", () => {
    const result = getMostSpecificCourts([]);
    expect(result).toBeNull();
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
