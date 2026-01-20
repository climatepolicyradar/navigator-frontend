import { TTopic } from "@/types";
import { groupByRootConcept } from "@/utils/conceptsGroupedbyRootConcept";

const ROOT_CONCEPTS: TTopic[] = [
  {
    alternative_labels: [],
    definition: "RC1 definition.",
    description: "RC1 description.",
    has_subconcept: ["Q1652"],
    negative_labels: [],
    preferred_label: "rc1",
    recursive_subconcept_of: ["Q1171"],
    related_concepts: [],
    subconcept_of: ["Q1171"],
    wikibase_id: "Q1651",
  },
];

const CONCEPTS: TTopic[] = [
  {
    alternative_labels: [],
    definition: "c1 definition.",
    description: "c1 description.",
    has_subconcept: [],
    negative_labels: [],
    preferred_label: "c1",
    recursive_subconcept_of: ["Q1651", "Q1171", "Q1652"],
    related_concepts: [],
    subconcept_of: ["Q1652"],
    wikibase_id: "Q1653",
  },
  {
    alternative_labels: [],
    definition: "c2 definition.",
    description: "c2 description.",
    has_subconcept: [],
    negative_labels: [],
    preferred_label: "c2",
    recursive_subconcept_of: [],
    related_concepts: [],
    subconcept_of: [],
    wikibase_id: "Q1655",
  },
];

describe("groupByRootConcept: ", () => {
  it("should return an object with the key of the root concept and the one child concept", () => {
    const conceptsGrouped = groupByRootConcept(CONCEPTS.slice(0, 1), ROOT_CONCEPTS);

    expect(conceptsGrouped).toEqual({ [ROOT_CONCEPTS[0].wikibase_id]: [CONCEPTS[0]] });
  });

  it("should return an object with an 'other' key where no root is found", () => {
    const conceptsGrouped = groupByRootConcept(CONCEPTS, ROOT_CONCEPTS);

    expect(conceptsGrouped).toEqual({ [ROOT_CONCEPTS[0].wikibase_id]: [CONCEPTS[0]], Q000: [CONCEPTS[1]] });
  });
});
