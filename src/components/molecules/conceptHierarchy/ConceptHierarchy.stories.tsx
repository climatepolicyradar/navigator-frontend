import { Meta, StoryObj } from "@storybook/nextjs-vite";

import { TFamilyConceptTreeNode } from "@/utils/buildConceptHierarchy";

import { ConceptHierarchy } from "./ConceptHierarchy";

const meta = {
  title: "Molecules/ConceptHierarchy",
  component: ConceptHierarchy,
  parameters: {},
} satisfies Meta<typeof ConceptHierarchy>;
type TStory = StoryObj<typeof ConceptHierarchy>;

export default meta;

const exampleConceptTree: TFamilyConceptTreeNode = {
  id: "1",
  preferred_label: "Concept 1",
  type: "legal_category",
  ids: [],
  subconcept_of_labels: [],
  relation: "",
  children: [
    {
      id: "2",
      preferred_label: "Concept 1.1",
      type: "legal_category",
      children: [],
      ids: [],
      subconcept_of_labels: [],
      relation: "",
    },
    {
      id: "3",
      preferred_label: "Concept 1.2",
      type: "legal_category",
      ids: [],
      subconcept_of_labels: [],
      relation: "",
      children: [
        {
          id: "4",
          preferred_label: "Concept 1.2.1",
          type: "legal_category",
          children: [],
          ids: [],
          subconcept_of_labels: [],
          relation: "",
        },
      ],
    },
  ],
};

export const Default: TStory = {
  args: {
    concept: exampleConceptTree,
  },
};
