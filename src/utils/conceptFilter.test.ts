import { TConcept } from "@/types";

import { FilterSelectedConcepts } from "./conceptFilter";

// Mock concepts
const rootConcept1a: TConcept = {
  wikibase_id: "principal_law/Argentina",
  preferred_label: "Argentina",
  subconcept_of: [],
  recursive_subconcept_of: [],
  type: "principal_law",
  alternative_labels: [],
  negative_labels: [],
  description: "",
  related_concepts: [],
  has_subconcept: [],
};

const rootConcept1b: TConcept = {
  wikibase_id: "principal_law/Argentina_b",
  preferred_label: "Argentina2",
  subconcept_of: [],
  recursive_subconcept_of: [],
  type: "principal_law",
  alternative_labels: [],
  negative_labels: [],
  description: "",
  related_concepts: [],
  has_subconcept: [],
};

const subConceptOfRoot1a: TConcept = {
  wikibase_id: "principal_law/Article 3",
  preferred_label: "Article 3",
  subconcept_of: ["Constitution"],
  recursive_subconcept_of: [],
  type: "principal_law",
  alternative_labels: [],
  negative_labels: [],
  description: "",
  related_concepts: [],
  has_subconcept: [],
};

const subConceptOfRoot1b: TConcept = {
  wikibase_id: "principal_law/Article 3_b",
  preferred_label: "Article 3",
  subconcept_of: ["Constitution"],
  recursive_subconcept_of: [],
  type: "principal_law",
  alternative_labels: [],
  negative_labels: [],
  description: "",
  related_concepts: [],
  has_subconcept: [],
};

const rootConcept2: TConcept = {
  wikibase_id: "jurisdiction/Australia",
  preferred_label: "Australia",
  subconcept_of: [],
  recursive_subconcept_of: [],
  type: "jurisdiction",
  alternative_labels: [],
  negative_labels: [],
  description: "",
  related_concepts: [],
  has_subconcept: [],
};

const subConceptOfRoot2: TConcept = {
  wikibase_id: "jurisdiction/Australia",
  preferred_label: "Australia",
  subconcept_of: [],
  recursive_subconcept_of: [],
  type: "jurisdiction",
  alternative_labels: [],
  negative_labels: [],
  description: "",
  related_concepts: [],
  has_subconcept: [],
};

const relatedConcepts1: TConcept[] = [rootConcept1a, subConceptOfRoot1a, rootConcept1b, subConceptOfRoot1b];
const relatedConcepts2: TConcept[] = [rootConcept2, subConceptOfRoot2];

describe("FilterSelectedConcepts", () => {
  it("should select a root concept when not previously selected", () => {
    const result = FilterSelectedConcepts([], rootConcept1a, relatedConcepts1, undefined, true);
    expect(result).toEqual(["principal_law/Argentina"]);
  });

  it("should select a child concept and its root when not previously selected", () => {
    const result = FilterSelectedConcepts([], subConceptOfRoot1a, relatedConcepts1, rootConcept1a, true);
    expect(result).toEqual(["principal_law/Article 3", "principal_law/Argentina"]);
  });

  it("should deselect a root concept and all its child concepts when previously selected", () => {
    const result = FilterSelectedConcepts(["principal_law/Argentina", "principal_law/Article 3"], rootConcept1a, relatedConcepts1, undefined, true);
    expect(result).toEqual([]);
  });

  it("should deselect a child concept when previously selected and keep the root concept selected", () => {
    const result = FilterSelectedConcepts(
      ["principal_law/Argentina", "principal_law/Article 3"],
      subConceptOfRoot1a,
      relatedConcepts1,
      rootConcept1a,
      true
    );
    expect(result).toEqual(["principal_law/Argentina"]);
  });

  it("should select a root concept and deselect other root concepts of the same type when isRootConceptExclusive is true", () => {
    const result = FilterSelectedConcepts(["principal_law/Argentina"], rootConcept1b, relatedConcepts1, undefined, true);
    expect(result).toEqual(["principal_law/Argentina_b"]);
  });

  it("should select a root concept and retain other root concepts of different types when isRootConceptExclusive is true", () => {
    const result = FilterSelectedConcepts(["jurisdiction/Australia"], rootConcept1a, relatedConcepts1, undefined, true);
    expect(result).toEqual(["jurisdiction/Australia", "principal_law/Argentina"]);
  });

  it("should select a child concept and its root, deselecting other root concepts of the same type when isRootConceptExclusive is true", () => {
    const result = FilterSelectedConcepts(["principal_law/Argentina"], subConceptOfRoot1b, relatedConcepts1, rootConcept1b, true);
    expect(result).toEqual(["principal_law/Article 3_b", "principal_law/Argentina_b"]);
  });

  it("should select both multiple root concepts when isRootConceptExclusive is false", () => {
    const result = FilterSelectedConcepts(["principal_law/Argentina"], rootConcept1b, relatedConcepts1, undefined, false);
    expect(result).toEqual(["principal_law/Argentina", "principal_law/Argentina_b"]);
  });
});
