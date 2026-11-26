import { Meta, StoryObj } from "@storybook/nextjs-vite";

import { TNestedSearchLabel } from "@/types";

import { SubDivisionBlock } from "./SubDivisionBlock";

const meta = {
  title: "Blocks/SubDivisionBlock",
  component: SubDivisionBlock,
  argTypes: {},
} satisfies Meta<typeof SubDivisionBlock>;

type TStory = StoryObj<typeof SubDivisionBlock>;

export default meta;

const subdivision = (id: string, value: string, count: number): TNestedSearchLabel => ({
  id,
  type: "subdivision",
  value,
  alternative_labels: [],
  count,
  children: [],
});

export const Default: TStory = {
  args: {
    country: {
      id: "country::USA",
      type: "country",
      value: "United States",
      alternative_labels: [],
      count: 3,
      children: [
        subdivision("subdivision::US-AK", "Alaska", 2),
        subdivision("subdivision::US-AL", "Alabama", 1),
        subdivision("subdivision::US-AR", "Arkansas", 0),
      ],
    },
  },
};
