import { Meta, StoryObj } from "@storybook/react";

import { SubDivisionBlock } from "./SubDivisionBlock";

const meta = {
  title: "Blocks/SubDivisionBlock",
  component: SubDivisionBlock,
  argTypes: {
    title: { control: "text" },
    id: { control: "text" },
  },
} satisfies Meta<typeof SubDivisionBlock>;

type TStory = StoryObj<typeof SubDivisionBlock>;

export default meta;

export const Default: TStory = {
  args: {
    title: "Geographic sub-divisions",
    id: "section-subdivisions",
    subdivisions: [
      {
        code: "CA-ON",
        name: "Ontario",
        type: "Province",
        country_alpha_2: "CA",
        country_alpha_3: "CAN",
      },
      {
        code: "US-NY",
        name: "New York",
        type: "State",
        country_alpha_2: "US",
        country_alpha_3: "USA",
      },
      {
        code: "FR-IDF",
        name: "Île-de-France",
        type: "Region",
        country_alpha_2: "FR",
        country_alpha_3: "FRA",
      },
    ],
  },
};
