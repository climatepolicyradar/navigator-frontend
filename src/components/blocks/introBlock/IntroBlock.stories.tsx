import { Meta, StoryObj } from "@storybook/nextjs-vite";

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
    name: "United States",
    slug: "united-states-of-america",
  },
};
