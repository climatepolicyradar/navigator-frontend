import { Meta, StoryObj } from "@storybook/nextjs-vite";

import { COLLECTION_STUB } from "@/stubs/collectionStub";

import { EventsBlock } from "./EventsBlock";

const meta = {
  title: "Blocks/EventsBlock",
  component: EventsBlock,
  argTypes: {},
} satisfies Meta<typeof EventsBlock>;
type TStory = StoryObj<typeof EventsBlock>;

export default meta;

export const Default: TStory = {
  args: {
    families: COLLECTION_STUB.families,
  },
};
