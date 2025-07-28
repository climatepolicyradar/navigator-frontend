import { Meta, StoryObj } from "@storybook/react";

import { FAMILY_PAGE_STUB } from "@/stubs/familyPageStub";

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
    family: FAMILY_PAGE_STUB,
  },
};
