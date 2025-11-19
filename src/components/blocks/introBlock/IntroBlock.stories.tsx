import { Meta, StoryObj } from "@storybook/nextjs";

import { GeographyV2 } from "@/types";

import { IntroBlock } from "./IntroBlock";

const meta = {
  title: "Blocks/IntroBlock",
  component: IntroBlock,
  argTypes: {},
} satisfies Meta<typeof IntroBlock>;
type TStory = StoryObj<typeof IntroBlock>;

export default meta;

export const Default: TStory = {
  args: {
    geography: { name: "United States", slug: "united-states-of-america" } as unknown as GeographyV2,
  },
};
