import { IConcept as ILegalConcept } from "@/types";

import { FamilyConcept, getRecursiveParentLabels, mapFamilyConceptsToLegalConcepts } from "./familyConcepts";

const familyConcepts: FamilyConcept[] = [
  {
    relation: "jurisdiction",
    preferred_label: "New South Wales",
    subconcept_of_labels: ["Australia"],
  },
  {
    relation: "jurisdiction",
    preferred_label: "Australia",
    subconcept_of_labels: [],
  },
  {
    relation: "jurisdiction",
    preferred_label: "Supreme Court of New south Wales",
    subconcept_of_labels: ["New South Wales"],
  },
  {
    relation: "jurisdiction",
    preferred_label: "Bucharest Court of First Instance",
    subconcept_of_labels: ["Romania"],
  },
  {
    relation: "jurisdiction",
    preferred_label: "Bucharest Court of Appeal",
    subconcept_of_labels: ["Romania"],
  },
  {
    relation: "jurisdiction",
    preferred_label: "Romania",
    subconcept_of_labels: [],
  },
];

const expectedGroupMappedConcepts: ILegalConcept[] = [
  {
    wikibase_id: "jurisdiction/Australia",
    preferred_label: "Australia",
    subconcept_of: [],
    recursive_subconcept_of: [],
    type: "jurisdiction",
    // Not bothered
    alternative_labels: [],
    negative_labels: [],
    description: "",
    related_concepts: [],
    has_subconcept: [],
  },
  {
    wikibase_id: "jurisdiction/New South Wales",
    preferred_label: "New South Wales",
    subconcept_of: ["Australia"],
    recursive_subconcept_of: ["Australia"],
    type: "jurisdiction",
    // Not bothered
    alternative_labels: [],
    negative_labels: [],
    description: "",
    related_concepts: [],
    has_subconcept: [],
  },
  {
    wikibase_id: "jurisdiction/Supreme Court of New south Wales",
    preferred_label: "Supreme Court of New south Wales",
    subconcept_of: ["New South Wales"],
    recursive_subconcept_of: ["Australia", "New South Wales"],
    type: "jurisdiction",
    // Not bothered
    alternative_labels: [],
    negative_labels: [],
    description: "",
    related_concepts: [],
    has_subconcept: [],
  },
  {
    wikibase_id: "jurisdiction/Romania",
    preferred_label: "Romania",
    subconcept_of: [],
    recursive_subconcept_of: [],
    type: "jurisdiction",
    // Not bothered
    alternative_labels: [],
    negative_labels: [],
    description: "",
    related_concepts: [],
    has_subconcept: [],
  },
  {
    wikibase_id: "jurisdiction/Bucharest Court of Appeal",
    preferred_label: "Bucharest Court of Appeal",
    subconcept_of: ["Romania"],
    recursive_subconcept_of: ["Romania"],
    type: "jurisdiction",
    // Not bothered
    alternative_labels: [],
    negative_labels: [],
    description: "",
    related_concepts: [],
    has_subconcept: [],
  },
  {
    wikibase_id: "jurisdiction/Bucharest Court of First Instance",
    preferred_label: "Bucharest Court of First Instance",
    subconcept_of: ["Romania"],
    recursive_subconcept_of: ["Romania"],
    type: "jurisdiction",
    // Not bothered
    alternative_labels: [],
    negative_labels: [],
    description: "",
    related_concepts: [],
    has_subconcept: [],
  },
];

describe("groupFamilyConcepts", () => {
  it("should group family concepts by their root ancestor", () => {
    const result = mapFamilyConceptsToLegalConcepts(familyConcepts);
    expect(result).toEqual(expect.arrayContaining(expectedGroupMappedConcepts));
  });
});

describe("getRecursiveParentLabels", () => {
  it("", () => {
    const result = getRecursiveParentLabels(familyConcepts[2], familyConcepts);
    expect(result).toEqual(["Australia", "New South Wales"]);
  });
});
