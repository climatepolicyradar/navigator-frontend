import { Meta, StoryObj } from "@storybook/nextjs";

import { LATEST_ITEMS_STUB } from "@/stubs/latestItemsStub";

import { LatestItemsBlock } from "./LatestItemsBlock";

const meta = {
  title: "Blocks/LatestItemsBlock",
  component: LatestItemsBlock,
  argTypes: {},
} satisfies Meta<typeof LatestItemsBlock>;
type TStory = StoryObj<typeof LatestItemsBlock>;

export default meta;

export const Default: TStory = {
  args: {
    latestItems: LATEST_ITEMS_STUB,
  },
};
