import { Meta, StoryObj } from "@storybook/nextjs-vite";

import { FAMILY_NEW_STUB } from "@/stubs/familyNewStub";

import { FamilyBlock } from "./FamilyBlock";

const meta = {
  title: "Blocks/FamilyBlock",
  component: FamilyBlock,
  argTypes: {},
} satisfies Meta<typeof FamilyBlock>;
type TStory = StoryObj<typeof FamilyBlock>;

export default meta;

export const Default: TStory = {
  args: {
    family: FAMILY_NEW_STUB,
  },
};
