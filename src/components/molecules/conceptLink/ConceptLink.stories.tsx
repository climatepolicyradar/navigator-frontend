import { Meta, StoryObj } from "@storybook/nextjs-vite";

import { TNestedSearchLabel } from "@/types";

import { ConceptLink } from "./ConceptLink";

const meta = {
  title: "Molecules/ConceptLink",
  component: ConceptLink,
  parameters: { layout: "centered" },
  argTypes: {
    onClick: { control: false },
  },
} satisfies Meta<typeof ConceptLink>;
type TStory = StoryObj<typeof ConceptLink>;

export default meta;

const concepts: TNestedSearchLabel[] = [
  {
    id: "concept::Q412",
    type: "concept",
    value: "air pollution risk",
    description:
      "Air pollution involves harmful contaminants in the air, affecting both indoor and outdoor environments. It can lead to health issues like respiratory diseases and heart problems, and climate impacts such as global warming. Pollutants can damage plants, trees, habitats, and water bodies like rivers and lakes.",
    children: [],
  },
  {
    id: "concept::Q368",
    type: "concept",
    value: "marine risk",
    description:
      "Risks to the ecosystem health of the marine environment, including ocean warming, ocean acidification, and ocean deoxygenation, harming biodiversity, species health, ecosystem services, and coastal community livelihoods.",
    children: [],
  },
  {
    id: "concept::Q404",
    type: "concept",
    value: "terrestrial risk",
    description:
      'Terrestrial means "of the earth" and relates to the ecological system that includes all living organisms and their interactions within land-based environments, such as forests, grasslands, and deserts.',
    children: [],
  },
  {
    id: "concept::Q374",
    type: "concept",
    value: "extreme weather",
    description:
      "Extreme weather refers to events where a weather variable exceeds (or falls below) a threshold. Meaning it is significantly different from the average or usual weather pattern.",
    children: [],
  },
];

export const Single: TStory = {
  args: {
    concept: concepts[0],
  },
};

export const Multiple: TStory = {
  argTypes: {
    concept: { control: false },
  },
  render: () => (
    <div className="flex flex-row gap-4">
      {concepts.map((concept) => (
        <ConceptLink key={concept.id} concept={concept} />
      ))}
    </div>
  ),
};

export const WithOnClick: TStory = {
  name: "With onClick",
  args: {
    concept: concepts[1],
    onClick: (concept: TNestedSearchLabel) => alert(concept.value),
  },
};
