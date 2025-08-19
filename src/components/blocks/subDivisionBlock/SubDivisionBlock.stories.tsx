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
        code: "US-AK",
        name: "Alaska",
        type: "State",
        country_alpha_2: "US",
        country_alpha_3: "USA",
      },
      {
        code: "US-AL",
        name: "Alabama",
        type: "State",
        country_alpha_2: "US",
        country_alpha_3: "USA",
      },
      {
        code: "US-AR",
        name: "Arkansas",
        type: "State",
        country_alpha_2: "US",
        country_alpha_3: "USA",
      },
    ],
  },
};
