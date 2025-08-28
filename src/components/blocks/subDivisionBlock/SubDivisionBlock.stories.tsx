import { Meta, StoryObj } from "@storybook/react";

import { SubDivisionBlock } from "./SubDivisionBlock";

const meta = {
  title: "Blocks/SubDivisionBlock",
  component: SubDivisionBlock,
  argTypes: {},
} satisfies Meta<typeof SubDivisionBlock>;

type TStory = StoryObj<typeof SubDivisionBlock>;

export default meta;

export const Default: TStory = {
  args: {
    subdivisions: [
      {
        id: "1",
        name: "Alaska",
        type: "State",
        slug: "alaska",
      },
      {
        id: "2",
        name: "Alabama",
        type: "State",
        slug: "alabama",
      },
      {
        id: "3",
        name: "Arkansas",
        type: "State",
        slug: "arkansas",
      },
    ],
  },
};
