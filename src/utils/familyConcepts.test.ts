import { FamilyConcept, groupFamilyConcepts } from "./familyConcepts";

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
    subconcept_of_labels: ["Australia", "New South Wales"],
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

const expectedGroupConcepts = {
  Australia: [
    {
      relation: "jurisdiction",
      preferred_label: "Australia",
      subconcept_of_labels: [],
    },
    {
      relation: "jurisdiction",
      preferred_label: "New South Wales",
      subconcept_of_labels: ["Australia"],
    },
    {
      relation: "jurisdiction",
      preferred_label: "Supreme Court of New south Wales",
      subconcept_of_labels: ["Australia", "New South Wales"],
    },
  ],
  Romania: [
    {
      relation: "jurisdiction",
      preferred_label: "Romania",
      subconcept_of_labels: [],
    },
    {
      relation: "jurisdiction",
      preferred_label: "Bucharest Court of Appeal",
      subconcept_of_labels: ["Romania"],
    },
    {
      relation: "jurisdiction",
      preferred_label: "Bucharest Court of First Instance",
      subconcept_of_labels: ["Romania"],
    },
  ],
};

describe("groupFamilyConcepts", () => {
  it("should group family concepts by their root ancestor", () => {
    const result = groupFamilyConcepts(familyConcepts);
    expect(result).toEqual(expectedGroupConcepts);
  });
});
