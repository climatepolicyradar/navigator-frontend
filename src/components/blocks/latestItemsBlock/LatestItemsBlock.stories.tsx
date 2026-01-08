import { Meta, StoryObj } from "@storybook/nextjs-vite";

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

export const SmallBoundingBox: TStory = {
  args: {
    latestItems: LATEST_ITEMS_STUB,
  },
  render: ({ ...props }) => (
    <div className="w-1/2 h-[400px] flex">
      <LatestItemsBlock {...props} />
    </div>
  ),
};
