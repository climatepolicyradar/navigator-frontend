import { Meta, StoryObj } from "@storybook/react";

import { FAMILY_NEW_STUB } from "@/stubs/familyNewStub";

import { DocumentsBlock } from "./DocumentsBlock";

const meta = {
  title: "Blocks/DocumentsBlock",
  component: DocumentsBlock,
  argTypes: {},
} satisfies Meta<typeof DocumentsBlock>;
type TStory = StoryObj<typeof DocumentsBlock>;

export default meta;

export const Default: TStory = {
  args: {
    countries: [{ id: 31, display_value: "Hungary", slug: "hungary", value: "HUN", type: "ISO-3166", parent_id: 10 }],
    family: FAMILY_NEW_STUB,
    status: "success",
  },
};
