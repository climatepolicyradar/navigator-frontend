import { Meta, StoryObj } from "@storybook/nextjs-vite";

import { TTopic } from "@/types";

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

const concepts: Partial<TTopic>[] = [
  {
    preferred_label: "air pollution risk",
    description:
      "Air pollution involves harmful contaminants in the air, affecting both indoor and outdoor environments. It can lead to health issues like respiratory diseases and heart problems, and climate impacts such as global warming. Pollutants can damage plants, trees, habitats, and water bodies like rivers and lakes.",
    definition:
      "Air pollution involves harmful contaminants in the air, affecting both indoor and outdoor environments. It can lead to health issues like respiratory diseases and heart problems, and climate impacts such as global warming. Pollutants can damage plants, trees, habitats, and water bodies like rivers and lakes.",
    wikibase_id: "Q412",
  },
  {
    preferred_label: "marine risk",
    description:
      "Risks to the ecosystem health of the marine environment, including ocean warming, ocean acidification, and ocean deoxygenation, harming biodiversity, species health, ecosystem services, and coastal community livelihoods.",
    definition:
      "Environmental risks to marine ecosystems refer to threats from climate change impacts like rising sea temperatures, ocean acidification, and deoxygenation. These disrupt marine biodiversity, species health, and distribution, endangering ecosystem services and the livelihoods of coastal communities.",
    wikibase_id: "Q368",
  },
  {
    preferred_label: "terrestrial risk",
    description:
      'Terrestrial means "of the earth" and relates to the ecological system that includes all living organisms and their interactions within land-based environments, such as forests, grasslands, and deserts.',
    definition:
      'Terrestrial means "of the earth", and refers to factors and phenomena that occur on land and influence climatic conditions and environmental systems. It encompasses a range of land-based factors affecting climate and ecosystems, including events such as landslides, wildfires, and soil erosion. Examples of terrestrial ecosystems include the tropical rainforests, grasslands, and deserts.',
    wikibase_id: "Q404",
  },
  {
    preferred_label: "extreme weather",
    description:
      "Extreme weather refers to events where a weather variable exceeds (or falls below) a threshold. Meaning it is significantly different from the average or usual weather pattern.",
    definition:
      "Extreme weather refers to events where a weather variable exceeds (or falls below) a threshold, with thresholds defined differently across studies. Extreme weather events can span from hours (e.g., convective storms), days (e.g., heatwaves), to seasons and years (e.g., droughts), posing risks to health, livelihoods, assets, and ecosystems.",
    wikibase_id: "Q374",
  },
];

export const Single: TStory = {
  args: {
    concept: concepts[0] as TTopic,
  },
};

export const Multiple: TStory = {
  argTypes: {
    concept: { control: false },
  },
  render: () => (
    <div className="flex flex-row gap-4">
      {concepts.map((concept) => (
        <ConceptLink key={concept.wikibase_id} concept={concept as TTopic} />
      ))}
    </div>
  ),
};

export const WithOnClick: TStory = {
  name: "With onClick",
  args: {
    concept: concepts[1] as TTopic,
    onClick: (concept: TTopic) => alert(concept.preferred_label),
  },
};
