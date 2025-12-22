import { Meta, StoryObj } from "@storybook/nextjs";

import { GeographyV2 } from "@/types";

import { SubDivisionBlock } from "./SubDivisionBlock";

const meta = {
  title: "Blocks/SubDivisionBlock",
  component: SubDivisionBlock,
  argTypes: {},
} satisfies Meta<typeof SubDivisionBlock>;

type TStory = StoryObj<typeof SubDivisionBlock>;

export default meta;

const unitedStates: GeographyV2 = {
  id: "1",
  name: "United States",
  type: "country" as const,
  slug: "united-states",
  has_subconcept: [],
  subconcept_of: [],
};

export const Default: TStory = {
  args: {
    subdivisions: [
      {
        id: "1",
        name: "Alaska",
        type: "subdivision",
        slug: "alaska",
        subconcept_of: [unitedStates],
        has_subconcept: [],
      },
      {
        id: "2",
        name: "Alabama",
        type: "subdivision",
        slug: "alabama",
        subconcept_of: [unitedStates],
        has_subconcept: [],
      },
      {
        id: "3",
        name: "Arkansas",
        type: "subdivision",
        slug: "arkansas",
        subconcept_of: [unitedStates],
        has_subconcept: [],
      },
    ],
  },
};
